import ssl
import uuid
from datetime import datetime
from urllib.parse import unquote

from sqlalchemy import create_engine, String, Text, DateTime, ForeignKey, func, text
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from config import Config


def build_db_url(raw_url):
    """Turn the Supabase connection string into a SQLAlchemy URL.
    Parsed by hand so passwords with special characters (@ : / ? #) still work."""
    if not raw_url:
        raise RuntimeError("DATABASE_URL is not set in .env")
    rest = raw_url.strip().split("://", 1)[1]
    creds, _, location = rest.rpartition("@")
    username, _, password = creds.partition(":")
    hostport, _, path = location.partition("/")
    # Query options like ?sslmode= are psycopg-specific; pg8000 takes SSL settings via connect_args
    database = path.partition("?")[0]
    host, _, port = hostport.partition(":")
    return URL.create(
        drivername="postgresql+pg8000",
        username=unquote(username),
        password=unquote(password),
        host=host,
        port=int(port) if port else 5432,
        database=database or "postgres",
    )


def build_ssl_context():
    """Encrypt the connection without verifying the certificate (like sslmode=require).
    Supabase signs its certs with its own CA, which isn't in the system trust store."""
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    return context


# pg8000 is pure Python, so it can't clash with TensorFlow's native libraries in Docker.
# pool_pre_ping re-checks connections, since the Supabase pooler closes idle ones
engine = create_engine(
    build_db_url(Config.DATABASE_URL),
    connect_args={"ssl_context": build_ssl_context()},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(80), unique=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    hashed_password: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class EmotionHistory(Base):
    __tablename__ = "emotion_history"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    # Deleting a user also deletes their history rows
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    detected_emotion: Mapped[str] = mapped_column(String(20))
    # Path inside the storage bucket (used for deleting) and its public URL (used for display)
    image_path: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


def init_db():
    """Create tables if missing and turn on Row Level Security.
    RLS with no policies blocks Supabase's public REST API; the backend still works
    because it connects as the table owner."""
    Base.metadata.create_all(engine)
    with engine.begin() as conn:
        for table in Base.metadata.tables:
            conn.execute(text(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY'))
