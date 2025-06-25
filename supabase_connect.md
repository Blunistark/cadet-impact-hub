# Connecting to Supabase

To connect to your Supabase project, you'll need your Project URL and your `anon` key.

1.  **Find your Supabase Project URL and anon key:**
    *   Go to your Supabase project dashboard.
    *   Navigate to **Project Settings** (the gear icon).
    *   Click on **API**.
    *   Under **Project API keys**, you'll find your `anon` (public) key and the Project URL.

2.  **Install the Supabase client library:**

    For JavaScript/TypeScript projects, you can use npm or yarn:
    ```bash
    npm install @supabase/supabase-js
    # or
    yarn add @supabase/supabase-js
    ```

3.  **Initialize the Supabase client:**

    Create a Supabase client instance in your application. It's common to do this in a dedicated file (e.g., `supabaseClient.js` or `lib/supabase.ts`).

    ```javascript
    // Example: src/lib/supabase.ts
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'; // Replace with your Project URL
    const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key

    if (!supabaseUrl) {
      throw new Error("Missing env.SUPABASE_URL");
    }

    if (!supabaseAnonKey) {
      throw new Error("Missing env.SUPABASE_ANON_KEY");
    }

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

    **Important:**
    *   Replace `'YOUR_SUPABASE_PROJECT_URL'` and `'YOUR_SUPABASE_ANON_KEY'` with your actual Supabase Project URL and anon key.
    *   It's highly recommended to store these values in environment variables rather than hardcoding them directly in your application code, especially for production environments. For example, you could use a `.env` file.

    Example using environment variables:

    ```javascript
    // Example: src/lib/supabase.ts
    import { createClient } from '@supabase/supabase-js';

    // These variables would typically come from process.env or a similar mechanism
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
    }

    if (!supabaseAnonKey) {
      throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

4.  **Using the client:**

    Once initialized, you can use the `supabase` client to interact with your database.

    ```javascript
    import { supabase } from './lib/supabase'; // Adjust path as needed

    async function getProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
        return null;
      }

      return data;
    }

    async function addProblem(problemData) {
      const { data, error } = await supabase
        .from('problems')
        .insert([problemData]); // problemData should be an object matching the table structure

      if (error) {
        console.error('Error adding problem:', error);
        return null;
      }

      return data;
    }

    // Example usage:
    getProfiles().then(profiles => {
      if (profiles) {
        console.log('Fetched profiles:', profiles);
      }
    });
    ```

This guide should help you get started with connecting your application to your new Supabase database.
