import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Assistant from "./Modules/AssistantModule.js";
import Members from "./Modules/MembersModule.js";
import Announcement from "./Modules/AnnouncementModule.js";
import Achievement from "./Modules/AchievenentsModule.js";

dotenv.config();

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected successfully!");

        // 1. Clear existing data
        console.log("Clearing existing collections...");
        await Assistant.deleteMany({});
        await Members.deleteMany({});
        await Announcement.deleteMany({});
        await Achievement.deleteMany({});

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("Pass@1234", saltRounds);

        // 2. Seed Assistant
        console.log("Seeding Assistant...");
        await Assistant.create({
            img: "https://via.placeholder.com/150",
            name: "Mohamed Assistant",
            email: "moh.assistant@faculty.edu",
            phone: "0123456789",
            password: hashedPassword,
            address: "Faculty of Medicine, Main Building",
            shifts: [
                {
                    assistantId: "temp-id",
                    department: "Pediatrics",
                    shiftStartTime: new Date().toISOString(),
                    shiftEndTime: new Date(Date.now() + 8 * 3600000).toISOString()
                }
            ]
        });

        // 3. Seed Member
        console.log("Seeding Member...");
        await Members.create({
            img: "https://via.placeholder.com/150",
            name: "Mohamed Member",
            department: "Pediatrics",
            title: "Senior Doctor",
            email: "moh.member@faculty.edu",
            phone: "0987654321",
            password: hashedPassword,
            address: "Pediatrics Ward A"
        });

        // 4. Seed Announcements
        console.log("Seeding Announcements...");
        await Announcement.create([
            {
                title: "Welcome to the New System",
                date: new Date().toLocaleDateString(),
                department: "General",
                content: "We have successfully migrated to our new management system.",
                blog: [
                    {
                        title: "System Update",
                        excerpt: "The new system is now live for all faculty members."
                    }
                ]
            },
            {
                title: "Pediatrics Staff Meeting",
                date: new Date().toLocaleDateString(),
                department: "Pediatrics",
                content: "A mandatory meeting for all pediatric staff this Friday.",
                blog: [
                    {
                        title: "Meeting Details",
                        excerpt: "Topic: Summer schedule and emergency protocols."
                    }
                ]
            }
        ]);

        // 5. Seed Achievements
        console.log("Seeding Achievements...");
        await Achievement.create([
            {
                title: "Top Faculty Department 2025",
                date: new Date().toLocaleDateString(),
                description: "Recognized for excellence in medical education and emergency response.",
                blog: [
                    {
                        title: "Award Ceremony",
                        excerpt: "The faculty received the award for outstanding performance."
                    }
                ]
            }
        ]);


        console.log("✅ Database Reseeded Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
