# Setup Instructions - Hunger Games Simulator

## ✅ Step 1: Environment Variables (COMPLETED)
You've already created `.env.local` with your Supabase credentials. Great!

## 🔧 Step 2: Database Setup

### Option A: Fresh Database Setup
If you're setting up a new database, run the complete schema:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run `scripts/001_create_hunger_games_tables.sql` (this now includes `image_url`)

### Option B: Existing Database (Migration)
If your database already exists, you need to add the `image_url` column:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run `scripts/002_add_image_url_to_characters.sql`

**Quick Check**: Verify the column exists:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'characters';
```

You should see both `avatar_color` and `image_url` columns.

## 🚀 Step 3: Test the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser**:
   - Navigate to http://localhost:3000
   - The app should load without errors

4. **Test Character Management**:
   - Click "Personajes" button
   - Add a character with a name
   - Try adding a character with an image URL (optional)
   - Verify characters are saved and displayed

## 🐛 Troubleshooting

### Error: "relation 'characters' does not exist"
**Solution**: Run the SQL schema script (`001_create_hunger_games_tables.sql`) in Supabase SQL Editor.

### Error: "column 'image_url' does not exist"
**Solution**: Run the migration script (`002_add_image_url_to_characters.sql`) in Supabase SQL Editor.

### Error: "Invalid API key" or connection errors
**Solution**: 
- Verify your `.env.local` file has correct values
- Check that `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the correct anon/public key (not the service role key)
- Restart your dev server after changing `.env.local`

### Characters not loading
**Solution**:
- Check browser console for errors
- Verify RLS policies are set correctly (should allow public access based on the schema)
- Check Supabase Dashboard → Table Editor → characters table to see if data exists

## 📝 Next Steps

Once everything is working:

1. **Add at least 24 characters** to start a game
2. **Assign tributes** using the "Tributos" button
3. **Start simulating** the Hunger Games!

## 🔒 Security Note

Currently, the database uses public RLS policies (anyone can read/write). For production:
- Implement Supabase Authentication
- Update RLS policies to be user-specific
- Consider rate limiting

---

**Need Help?** Check the `PROJECT_ANALYSIS.md` file for detailed project information.
