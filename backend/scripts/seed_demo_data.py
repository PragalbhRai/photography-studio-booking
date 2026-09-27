"""Seed demo data for photography studio."""

import uuid
from datetime import datetime, time
from decimal import Decimal

from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import engine
from app.core.security import get_password_hash
from app.models.booking import Booking, BookingStatus
from app.models.package import Package, PhotographerPackage
from app.models.photographer import (
    BlockedPeriod,
    PhotographerProfile,
    PortfolioImage,
    WorkingHours,
)
from app.models.user import User, UserRole


def seed_demo_data() -> None:
    """Seed comprehensive demo data for all photography specialties."""
    print("🌱 Seeding demo data...")
    
    with Session(engine) as session:
        # Create admin user
        admin = session.exec(
            select(User).where(User.email == settings.FIRST_SUPERUSER)
        ).first()
        
        if not admin:
            admin = User(
                email=settings.FIRST_SUPERUSER,
                password_hash=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Studio Admin",
                role=UserRole.ADMIN,
            )
            session.add(admin)
            session.commit()
            session.refresh(admin)
            print(f"✓ Admin created: {admin.email}")
        else:
            print(f"✓ Admin exists: {admin.email}")
        
        # Create demo customer
        customer_email = "customer@example.com"
        customer = session.exec(
            select(User).where(User.email == customer_email)
        ).first()
        
        if not customer:
            customer = User(
                email=customer_email,
                password_hash=get_password_hash("customer123"),
                full_name="Demo Customer",
                role=UserRole.CUSTOMER,
            )
            session.add(customer)
            session.commit()
            session.refresh(customer)
            print(f"✓ Customer created: {customer.email}")
        else:
            print(f"✓ Customer exists: {customer.email}")
        
        # Create photographers with diverse specialties
        photographers_data = [
            {
                "email": "aarav@studio.com",
                "full_name": "Aarav Sharma",
                "bio": "Award-winning wedding photographer with 12+ years capturing lavish celebrations and intimate rituals across Jaipur, Udaipur, and Goa. Blends royal editorial framing with candid emotional moments.",
                "specialties": ["Weddings & Celebrations", "Pre-Wedding & Engagement"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1583939003579-730e3918a45a", "caption": "Palace wedding celebration"},
                    {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c", "caption": "Bridal portrait in traditional silks"},
                    {"url": "https://images.unsplash.com/photo-1519741497674-611481863552", "caption": "Sangeet evening celebration"},
                    {"url": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92", "caption": "Varmala ceremony under mandap"},
                ],
            },
            {
                "email": "rohan@studio.com",
                "full_name": "Rohan Kapoor",
                "bio": "Specializing in cinematic pre-wedding and engagement stories in iconic heritage forts, ghats, and mountain getaways. Dedicated to capturing spontaneous chemistry and grand vistas.",
                "specialties": ["Pre-Wedding & Engagement", "Portraits & Headshots"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2", "caption": "Sunset dunes pre-wedding session"},
                    {"url": "https://images.unsplash.com/photo-1522673607200-164d1b6ce486", "caption": "Urban Delhi couple portrait"},
                    {"url": "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8", "caption": "Beach twilight romance in Goa"},
                    {"url": "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb", "caption": "Lakeside golden hour storytelling"},
                ],
            },
            {
                "email": "ananya@studio.com",
                "full_name": "Ananya Iyer",
                "bio": "Portrait and personal branding specialist crafting expressive headshots for founders, artists, and leaders. Masters natural light and studio strobe minimalism.",
                "specialties": ["Portraits & Headshots", "Fashion & Editorial"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", "caption": "Corporate leadership portrait"},
                    {"url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb", "caption": "Natural daylight studio portrait"},
                    {"url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", "caption": "Founder executive headshot"},
                    {"url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", "caption": "Editorial monochrome portrait"},
                ],
            },
            {
                "email": "priya@studio.com",
                "full_name": "Priya Nair",
                "bio": "Fashion and haute-couture editorial photographer collaborating with leading Indian designers, Lakmé Fashion Week campaigns, and high-street textile houses.",
                "specialties": ["Fashion & Editorial", "Product & Brand Photography"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1509631179647-0177331693ae", "caption": "Couture editorial campaign"},
                    {"url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d", "caption": "Contemporary handloom collection"},
                    {"url": "https://images.unsplash.com/photo-1483985988355-763728e1935b", "caption": "Urban street fashion story"},
                    {"url": "https://images.unsplash.com/photo-1558769132-cb1aea9c1f83", "caption": "Festive jewel-tone editorial"},
                ],
            },
            {
                "email": "meera@studio.com",
                "full_name": "Meera Deshmukh",
                "bio": "Fine art maternity and newborn photographer creating gentle, warm portraits that celebrate motherhood and growing families with delicate attention.",
                "specialties": ["Maternity & Newborn"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9", "caption": "Serene fine-art maternity sitting"},
                    {"url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4", "caption": "Newborn in soft organic swaddles"},
                    {"url": "https://images.unsplash.com/photo-1516627145497-ae6968895b74", "caption": "Generational family blessing"},
                    {"url": "https://images.unsplash.com/photo-1519689373023-dd07c7988603", "caption": "Tender mother and child portrait"},
                ],
            },
            {
                "email": "vikram@studio.com",
                "full_name": "Vikramaditya Roy",
                "bio": "Documentary and large-scale corporate event specialist for technology summits, cultural festivals, award galas, and national brand conventions.",
                "specialties": ["Events & Corporate"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87", "caption": "Bengaluru tech summit keynote"},
                    {"url": "https://images.unsplash.com/photo-1511578314322-379afb476865", "caption": "EV product reveal stage"},
                    {"url": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678", "caption": "VIP networking gala"},
                    {"url": "https://images.unsplash.com/photo-1505236858219-8359eb29e329", "caption": "Annual startup awards celebration"},
                ],
            },
            {
                "email": "kabir@studio.com",
                "full_name": "Kabir Malhotra",
                "bio": "Precision product and heritage jewelry photographer helping modern direct-to-consumer and luxury brands tell tactile, desire-inducing visual stories.",
                "specialties": ["Product & Brand Photography"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30", "caption": "Minimalist luxury product aesthetic"},
                    {"url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "caption": "Artisanal lifestyle fragrance shoot"},
                    {"url": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f", "caption": "Crafted timepiece studio lighting"},
                    {"url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f", "caption": "Botanical skincare line"},
                ],
            },
            {
                "email": "diya@studio.com",
                "full_name": "Diya Sengupta",
                "bio": "Travel and heritage documentarian capturing cultural tapestries, colonial architecture, Himalayan expeditions, and living crafts across South Asia.",
                "specialties": ["Travel & Lifestyle"],
                "portfolio": [
                    {"url": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", "caption": "Backwaters lifestyle journey"},
                    {"url": "https://images.unsplash.com/photo-1488646953014-85cb44e25828", "caption": "Old Delhi artisan alleyways"},
                    {"url": "https://images.unsplash.com/photo-1503220317375-aaad61436b1b", "caption": "Himalayan dawn visual diary"},
                    {"url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800", "caption": "Kashmir valley expedition story"},
                ],
            },
        ]
        
        photographers = []
        for photo_data in photographers_data:
            user = session.exec(
                select(User).where(User.email == photo_data["email"])
            ).first()
            
            if not user:
                user = User(
                    email=photo_data["email"],
                    password_hash=get_password_hash("photographer123"),
                    full_name=photo_data["full_name"],
                    role=UserRole.PHOTOGRAPHER,
                )
                session.add(user)
                session.commit()
                session.refresh(user)
            
            profile = session.exec(
                select(PhotographerProfile).where(PhotographerProfile.user_id == user.id)
            ).first()
            
            if not profile:
                profile = PhotographerProfile(
                    user_id=user.id,
                    bio=photo_data["bio"],
                    specialties=photo_data["specialties"],
                )
                session.add(profile)
                session.commit()
                session.refresh(profile)
                
                # Add portfolio images
                for idx, img in enumerate(photo_data["portfolio"]):
                    portfolio_img = PortfolioImage(
                        photographer_id=profile.id,
                        image_url=img["url"],
                        caption=img["caption"],
                        sort_order=idx,
                    )
                    session.add(portfolio_img)
                
                # Add working hours (Mon-Fri, 9am-5pm)
                for day in range(5):  # Monday to Friday
                    working_hours = WorkingHours(
                        photographer_id=profile.id,
                        day_of_week=day,
                        start_time=time(9, 0),
                        end_time=time(17, 0),
                    )
                    session.add(working_hours)
                
                session.commit()
                print(f"✓ Photographer created: {photo_data['full_name']}")
            else:
                print(f"✓ Photographer exists: {photo_data['full_name']}")
            
            photographers.append(profile)
        
        # Create packages for all specialties
        packages_data = [
            # Weddings & Celebrations
            {
                "name": "The Grand Royal Wedding",
                "description": "Complete wedding day coverage from Haldi and Baraat to the Varmala and Reception. Includes lead and secondary photographers, 600+ master-graded images, and curated digital gallery.",
                "price": Decimal("150000.00"),
                "duration_minutes": 480,
                "category": "Weddings & Celebrations",
                "image_url": "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
                "photographers": [0, 1],  # Aarav, Rohan
            },
            {
                "name": "Intimate Mandap Ceremony",
                "description": "Focused coverage for intimate weddings, Anand Karaj, or temple rituals. Four hours of dedicated photography with 300+ edited images delivered digitally.",
                "price": Decimal("65000.00"),
                "duration_minutes": 240,
                "category": "Weddings & Celebrations",
                "image_url": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92",
                "photographers": [0, 1],
            },
            # Pre-Wedding & Engagement
            {
                "name": "Heritage Couple Editorial",
                "description": "Cinematic pre-wedding session in your choice of palace ruins, heritage stepwells, or scenic landscapes. Two hours of creative styling and 100+ high-res images.",
                "price": Decimal("35000.00"),
                "duration_minutes": 120,
                "category": "Pre-Wedding & Engagement",
                "image_url": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
                "photographers": [1],  # Rohan
            },
            {
                "name": "Sunset Pre-Wedding Romance",
                "description": "Romantic golden hour photography session. Ideal for engagement invitations or pre-wedding teaser reels with 80+ color-graded portraits.",
                "price": Decimal("25000.00"),
                "duration_minutes": 90,
                "category": "Pre-Wedding & Engagement",
                "image_url": "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb",
                "photographers": [1],
            },
            # Portraits & Headshots
            {
                "name": "Signature Executive Portrait",
                "description": "Premium portrait session for leadership profiles, founders, and personal branding. Studio or outdoor set, professional retouching, and 30+ deliverable files.",
                "price": Decimal("15000.00"),
                "duration_minutes": 90,
                "category": "Portraits & Headshots",
                "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                "photographers": [2, 1],  # Ananya, Rohan
            },
            {
                "name": "Professional Headshots",
                "description": "Modern studio headshots for LinkedIn, corporate directories, and publication bylines. Fast turnaround with 10 retouched finals.",
                "price": Decimal("8000.00"),
                "duration_minutes": 60,
                "category": "Portraits & Headshots",
                "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                "photographers": [2],
            },
            # Fashion & Editorial
            {
                "name": "High Fashion Editorial Day",
                "description": "Full-day high fashion and couture editorial production. Concept board, lookbook guidance, strobe setups, and 150+ high-end retouched frames.",
                "price": Decimal("55000.00"),
                "duration_minutes": 360,
                "category": "Fashion & Editorial",
                "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae",
                "photographers": [3],  # Priya
            },
            {
                "name": "Designer Campaign Collection",
                "description": "Half-day fashion shoot for boutique labels, festive drops, and e-commerce hero banners. Includes 80+ edited frames.",
                "price": Decimal("35000.00"),
                "duration_minutes": 180,
                "category": "Fashion & Editorial",
                "image_url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
                "photographers": [3],
            },
            # Maternity & Newborn
            {
                "name": "Fine Art Maternity",
                "description": "Poetic maternity portraits honoring your motherhood chapter. Studio drape styling, partner poses, and 50+ warm fine-art images.",
                "price": Decimal("22000.00"),
                "duration_minutes": 90,
                "category": "Maternity & Newborn",
                "image_url": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9",
                "photographers": [4],  # Meera
            },
            {
                "name": "Motherhood & Newborn Story",
                "description": "Two combined sessions: one during third trimester and one newborn session at your home. Gentle, unhurried posing with 100+ edited photographs.",
                "price": Decimal("32000.00"),
                "duration_minutes": 120,
                "category": "Maternity & Newborn",
                "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
                "photographers": [4],
            },
            # Events & Corporate
            {
                "name": "Corporate Summit & Gala Coverage",
                "description": "Comprehensive photography for high-profile business summits, award nights, and panel sessions. Real-time media deliverables and full high-res catalog.",
                "price": Decimal("45000.00"),
                "duration_minutes": 360,
                "category": "Events & Corporate",
                "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
                "photographers": [5],  # Vikramaditya
            },
            {
                "name": "Brand Event & Celebration",
                "description": "Half-day coverage for product reveals, milestone dinners, and festive gatherings. 150+ vibrant candid and keynote frames.",
                "price": Decimal("25000.00"),
                "duration_minutes": 180,
                "category": "Events & Corporate",
                "image_url": "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
                "photographers": [5],
            },
            # Product & Brand
            {
                "name": "Luxury Jewelry & Product Launch",
                "description": "High-magnification studio photography for jewelry, luxury goods, and craft objects. Focus stacking, color accuracy, and reflective surface mastery.",
                "price": Decimal("35000.00"),
                "duration_minutes": 240,
                "category": "Product & Brand Photography",
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                "photographers": [6],  # Kabir
            },
            {
                "name": "Brand Content & Catalog Session",
                "description": "Tactile lifestyle product photography for digital storefronts and social feeds. Half-day session with 75+ polished frames.",
                "price": Decimal("22000.00"),
                "duration_minutes": 180,
                "category": "Product & Brand Photography",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                "photographers": [6],
            },
            # Travel & Lifestyle
            {
                "name": "Destination Travel & Heritage Story",
                "description": "Full-day lifestyle and documentary series across India's vibrant locales. Ideal for hospitality, luxury travel publications, and private visual diaries.",
                "price": Decimal("60000.00"),
                "duration_minutes": 360,
                "category": "Travel & Lifestyle",
                "image_url": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
                "photographers": [7],  # Diya
            },
            {
                "name": "Lifestyle Journey Feature",
                "description": "Half-day experiential photo session celebrating local heritage, culinary moments, and atmospheric travel stories. 100+ edited images.",
                "price": Decimal("28000.00"),
                "duration_minutes": 180,
                "category": "Travel & Lifestyle",
                "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
                "photographers": [7],
            },
        ]
        
        packages = []
        for pkg_data in packages_data:
            pkg = session.exec(
                select(Package).where(Package.name == pkg_data["name"])
            ).first()
            
            if not pkg:
                photographer_indices = pkg_data.pop("photographers")
                pkg = Package(**pkg_data)
                session.add(pkg)
                session.commit()
                session.refresh(pkg)
                
                # Link photographers to package
                for idx in photographer_indices:
                    link = PhotographerPackage(
                        photographer_id=photographers[idx].id,
                        package_id=pkg.id,
                    )
                    session.add(link)
                
                session.commit()
                print(f"✓ Package created: {pkg.name}")
            else:
                print(f"✓ Package exists: {pkg.name}")
            
            packages.append(pkg)
        
        print("\n✅ Demo data seeding complete!")
        print(f"   - {len(photographers)} photographers")
        print(f"   - {len(packages)} packages")
        print(f"   - Portfolio images and working hours configured")
        print(f"\n🔐 Demo accounts:")
        print(f"   Admin: {settings.FIRST_SUPERUSER} / {settings.FIRST_SUPERUSER_PASSWORD}")
        print(f"   Customer: customer@example.com / customer123")
        print(f"   Photographers: photographer@studio.com / photographer123")


if __name__ == "__main__":
    seed_demo_data()
