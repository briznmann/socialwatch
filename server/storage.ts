import {
  users,
  profiles,
  screenshots,
  type User,
  type UpsertUser,
  type Profile,
  type InsertProfile,
  type Screenshot,
  type InsertScreenshot,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  getProfilesByUserId(userId: string): Promise<Profile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile>;
  deleteProfile(id: string): Promise<void>;
  
  // Screenshot operations
  getScreenshotsByProfileId(profileId: string, limit?: number): Promise<Screenshot[]>;
  getRecentScreenshots(userId: string, limit?: number): Promise<(Screenshot & { profile: Profile })[]>;
  createScreenshot(screenshot: InsertScreenshot): Promise<Screenshot>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    activeProfiles: number;
    screenshotsToday: number;
    totalScreenshots: number;
    storageUsed: string;
    alerts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Profile operations
  async getProfilesByUserId(userId: string): Promise<Profile[]> {
    return await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .orderBy(desc(profiles.createdAt));
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return updatedProfile;
  }

  async deleteProfile(id: string): Promise<void> {
    await db.delete(profiles).where(eq(profiles.id, id));
  }
  
  // Screenshot operations
  async getScreenshotsByProfileId(profileId: string, limit = 50): Promise<Screenshot[]> {
    return await db
      .select()
      .from(screenshots)
      .where(eq(screenshots.profileId, profileId))
      .orderBy(desc(screenshots.capturedAt))
      .limit(limit);
  }

  async getRecentScreenshots(userId: string, limit = 10): Promise<(Screenshot & { profile: Profile })[]> {
    return await db
      .select({
        id: screenshots.id,
        profileId: screenshots.profileId,
        userId: screenshots.userId,
        imageUrl: screenshots.imageUrl,
        thumbnailUrl: screenshots.thumbnailUrl,
        postText: screenshots.postText,
        postUrl: screenshots.postUrl,
        capturedAt: screenshots.capturedAt,
        profile: profiles,
      })
      .from(screenshots)
      .innerJoin(profiles, eq(screenshots.profileId, profiles.id))
      .where(eq(screenshots.userId, userId))
      .orderBy(desc(screenshots.capturedAt))
      .limit(limit);
  }

  async createScreenshot(screenshot: InsertScreenshot): Promise<Screenshot> {
    const [newScreenshot] = await db
      .insert(screenshots)
      .values(screenshot)
      .returning();
    
    // Update profile's total screenshots count
    await db
      .update(profiles)
      .set({
        totalScreenshots: sql`${profiles.totalScreenshots} + 1`,
        lastCapturedAt: new Date(),
      })
      .where(eq(profiles.id, screenshot.profileId));
    
    return newScreenshot;
  }
  
  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    activeProfiles: number;
    screenshotsToday: number;
    totalScreenshots: number;
    storageUsed: string;
    alerts: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get active profiles count
    const [activeProfilesResult] = await db
      .select({ count: count() })
      .from(profiles)
      .where(and(eq(profiles.userId, userId), eq(profiles.isActive, true)));
    
    // Get screenshots today count
    const [screenshotsTodayResult] = await db
      .select({ count: count() })
      .from(screenshots)
      .where(and(
        eq(screenshots.userId, userId),
        sql`${screenshots.capturedAt} >= ${today}`
      ));
    
    // Get total screenshots count
    const [totalScreenshotsResult] = await db
      .select({ count: count() })
      .from(screenshots)
      .where(eq(screenshots.userId, userId));
    
    // Get profiles needing reconnect (alerts)
    const [alertsResult] = await db
      .select({ count: count() })
      .from(profiles)
      .where(and(eq(profiles.userId, userId), eq(profiles.needsReconnect, true)));
    
    return {
      activeProfiles: activeProfilesResult.count,
      screenshotsToday: screenshotsTodayResult.count,
      totalScreenshots: totalScreenshotsResult.count,
      storageUsed: "2.4 GB", // Mock storage calculation
      alerts: alertsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
