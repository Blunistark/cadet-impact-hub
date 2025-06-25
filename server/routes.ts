import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, profiles, problems, insertProfileSchema, insertProblemSchema } from "./db";
import { eq, and, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(['cadet', 'ano']).optional(),
  unitCode: z.string().optional(),
  directorate: z.string().optional(),
  rank: z.string().optional(),
  institute: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = authSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.select().from(profiles).where(eq(profiles.email, userData.email));
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      // Generate UUID for new user
      const userId = crypto.randomUUID();
      
      // Determine role based on email
      const role = userData.email.includes('ano') || userData.email.includes('officer') ? 'ano' : 'cadet';
      
      // Create user
      const [newUser] = await db.insert(profiles).values({
        id: userId,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || role,
        unitCode: userData.unitCode,
        directorate: userData.directorate,
        rank: userData.rank,
        institute: userData.institute,
        passwordHash,
      }).returning();

      // Don't return password hash
      const { passwordHash: _, ...userWithoutPassword } = newUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user
      const [user] = await db.select().from(profiles).where(eq(profiles.email, email));
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Don't return password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  // Profile routes
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const [profile] = await db.select().from(profiles).where(eq(profiles.id, req.params.id));
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      const { passwordHash: _, ...profileWithoutPassword } = profile;
      res.json(profileWithoutPassword);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Problems routes
  app.get("/api/problems", async (req, res) => {
    try {
      const allProblems = await db.select({
        id: problems.id,
        title: problems.title,
        description: problems.description,
        location: problems.location,
        tags: problems.tags,
        status: problems.status,
        priority: problems.priority,
        postedBy: problems.postedBy,
        approvedBy: problems.approvedBy,
        approvalFeedback: problems.approvalFeedback,
        createdAt: problems.createdAt,
        updatedAt: problems.updatedAt,
        postedByProfile: {
          id: profiles.id,
          fullName: profiles.fullName,
          role: profiles.role,
        }
      })
      .from(problems)
      .leftJoin(profiles, eq(problems.postedBy, profiles.id))
      .orderBy(desc(problems.createdAt));

      res.json(allProblems);
    } catch (error) {
      console.error("Problems fetch error:", error);
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  });

  app.post("/api/problems", async (req, res) => {
    try {
      const problemData = insertProblemSchema.parse({
        ...req.body,
        id: crypto.randomUUID(),
      });
      
      const [newProblem] = await db.insert(problems).values(problemData).returning();
      res.json(newProblem);
    } catch (error) {
      console.error("Problem creation error:", error);
      res.status(400).json({ error: "Invalid problem data" });
    }
  });

  app.put("/api/problems/:id", async (req, res) => {
    try {
      const problemId = req.params.id;
      const updateData = req.body;
      
      const [updatedProblem] = await db
        .update(problems)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(problems.id, problemId))
        .returning();
        
      if (!updatedProblem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      
      res.json(updatedProblem);
    } catch (error) {
      console.error("Problem update error:", error);
      res.status(500).json({ error: "Failed to update problem" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
