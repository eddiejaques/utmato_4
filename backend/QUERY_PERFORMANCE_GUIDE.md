# Query Performance & Indexing Guide

This guide explains how to apply the new performance indexes, analyze query execution times, and monitor/optimize database performance for the Utmato backend.

---

## 1. Apply the New Alembic Migration

1. **Activate the backend virtual environment:**
   ```bash
   cd backend
   source venv/bin/activate
   ```
2. **Run Alembic migrations:**
   ```bash
   alembic upgrade head
   ```
   This will apply the new indexes for campaigns and UTM links.

---

## 2. Analyze Query Performance with EXPLAIN ANALYZE

1. **Connect to your PostgreSQL database:**
   ```bash
   psql $DATABASE_URL
   ```
2. **Copy the SQL generated by your ORM queries.**
   - You can enable SQL echo in SQLAlchemy or log queries to see the raw SQL.
   - Example (from `search_service.py`):
     ```sql
     SELECT * FROM campaigns WHERE company_id = '<company_id>' AND to_tsvector('english', coalesce(name, '') || ' ' || coalesce(demographics, '') || ' ' || coalesce(interests, '')) @@ to_tsquery('english', '<query>');
     ```
3. **Run EXPLAIN ANALYZE:**
   ```sql
   EXPLAIN ANALYZE <your_query_here>;
   ```
   - This will output the query plan and execution time.
   - Look for slow steps (Seq Scan, Filter, etc.) and check if indexes are being used.

---

## 3. Monitor and Optimize

- **Supabase Analytics:**
  - If using Supabase, use the Analytics dashboard to monitor slow queries and index usage.
- **Optimize Queries:**
  - Use `selectinload` or similar patterns to avoid N+1 queries (already applied in service layer).
  - Add or adjust indexes as needed based on query patterns and EXPLAIN ANALYZE results.
- **Test Performance:**
  - Add or update tests to ensure optimized queries return correct results and perform efficiently.

---

## 4. Troubleshooting

- If a query is still slow after adding indexes:
  - Double-check the query plan with `EXPLAIN ANALYZE`.
  - Consider composite or partial indexes for more specific filtering.
  - Review your ORM query for unnecessary joins or filters.

---

## Verifying and Testing the New Schema After Migrations

After running Alembic migrations, verify your schema as follows:

### 1. Check Database Structure (psql or SQL client)

```
\dt
\d+ campaigns
\d+ invitations
\d+ roles
\d+ team_memberships
```
- Ensure `campaigns` has `demographics` and `interests` columns.
- Ensure `invitations`, `roles`, and `team_memberships` tables exist with correct columns and types.

### 2. Check Enum Types

```
SELECT unnest(enum_range(NULL::userrole));
SELECT unnest(enum_range(NULL::invitestatus));
```
- Confirm values match your models.

### 3. Test with SQL Inserts

```
INSERT INTO roles (id, name) VALUES (gen_random_uuid(), 'Manager');
-- Insert a company, then a user, then a team_membership, etc.
```

### 4. Test with SQLAlchemy (Python)
- Write a script or use FastAPI shell to create/query objects for each new model and check relationships.

### 5. Run Automated Tests (if available)

```
pytest
```
- Or create a new test in `backend/app/tests/` to check model creation and relationships.

### 6. Check Alembic History

```
alembic history
```
- Ensure all migrations are listed and applied.

---

**For further help, see the FastAPI and SQLAlchemy documentation, or contact the backend maintainers.** 