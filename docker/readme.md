# no password
```bash
docker-compose up -d
docker exec -it nuxsaas_db bash
```

```bash
root@dfe6e8869229:/# psql -U postgres -d nuxsaas
\l
\c nuxsaas
\dt
\d table_name
SELECT * FROM table_name LIMIT 10;

\q
```

# with password
```bash
root@dfe6e8869229:/# psql -U postgres -d postgres -W
```

NUXT_DATABASE_URL=postgres://postgres:supersecret@localhost:5432/nuxsaas


# table
```
nuxsaas-# \dt
            List of relations
 Schema |     Name     | Type  |  Owner   
--------+--------------+-------+----------
 public | account      | table | postgres
 public | audit_log    | table | postgres
 public | file         | table | postgres
 public | subscription | table | postgres
 public | user         | table | postgres
 public | verification | table | postgres
(6 rows)
```

```
nuxsaas-# \d user
                                Table "public.user"
       Column       |            Type             | Collation | Nullable | Default 
--------------------+-----------------------------+-----------+----------+---------
 id                 | uuid                        |           | not null | 
 name               | text                        |           | not null | 
 email              | text                        |           | not null | 
 email_verified     | boolean                     |           | not null | false
 image              | text                        |           |          | 
 created_at         | timestamp without time zone |           | not null | now()
 updated_at         | timestamp without time zone |           | not null | now()
 role               | text                        |           |          | 
 banned             | boolean                     |           |          | false
 ban_reason         | text                        |           |          | 
 ban_expires        | timestamp without time zone |           |          | 
 stripe_customer_id | text                        |           |          | 
 polar_customer_id  | text                        |           |          | 
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)
    "user_email_unique" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "account" CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
    TABLE "audit_log" CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE SET NULL
```

```bash
nuxsaas=# SELECT * FROM "user" LIMIT 10;
```