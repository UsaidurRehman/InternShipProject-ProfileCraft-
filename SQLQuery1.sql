-- ============================================================
--  ProfileCraft - Full Database Setup Script
--  Run this entire file in SQL Server Management Studio (SSMS)
--  against your DESKTOP-4HSSL4Q\SQLEXPRESS instance
-- ============================================================


-- ============================================================
-- STEP 1: Create the database (skip if already exists)
-- ============================================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ProfileCraft')
BEGIN
    CREATE DATABASE ProfileCraft;
    PRINT 'Database ProfileCraft created.';
END
ELSE
BEGIN
    PRINT 'Database ProfileCraft already exists.';
END
GO

USE ProfileCraft;
GO


-- ============================================================
-- STEP 2: TABLE — UserData
--   Stores registered users (auth credentials)
--   Referenced by: Register.js, Signin.js, deleteAccount.js
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserData')
BEGIN
    CREATE TABLE UserData (
        id               INT           IDENTITY(1,1) PRIMARY KEY,
        username         NVARCHAR(100) NOT NULL,
        email            NVARCHAR(255) NOT NULL UNIQUE,
        password         NVARCHAR(255) NOT NULL,   -- bcrypt hashed
        Confirm_password NVARCHAR(255) NOT NULL,   -- bcrypt hashed
        created_at       DATETIME      DEFAULT GETDATE()
    );
    PRINT 'Table UserData created.';
END
ELSE
BEGIN
    PRINT 'Table UserData already exists.';
END
GO


-- ============================================================
-- STEP 3: TABLE — UserDataTable
--   Stores the professional CV information entered in the
--   stepper form (Staperds.jsx). One row per user (upserted).
--   Referenced by: submitCv.js, checkUserData.js, userData.js,
--                  usersCVs.js (LEFT JOIN), deleteAccount.js
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserDataTable')
BEGIN
    CREATE TABLE UserDataTable (
        -- Identity & link to auth user
        id                     INT           IDENTITY(1,1) PRIMARY KEY,
        userId                 INT           NOT NULL UNIQUE,

        -- Personal Info
        username               NVARCHAR(100),
        phoneNumber            NVARCHAR(50),
        email                  NVARCHAR(255),
        profileLink            NVARCHAR(500),
        location               NVARCHAR(200),
        dob                    DATE,
        careerObjective        NVARCHAR(MAX),

        -- Education Section
        education_degree       NVARCHAR(200),
        education_institution  NVARCHAR(200),
        education_location     NVARCHAR(200),
        education_years        NVARCHAR(100),
        education_cgpa         NVARCHAR(20),

        -- Work Experience Section
        work_jobTitle          NVARCHAR(200),
        work_companyName       NVARCHAR(200),
        work_location          NVARCHAR(200),
        work_years             NVARCHAR(100),

        -- Skills Section
        skills_technical       NVARCHAR(MAX),
        skills_soft            NVARCHAR(MAX),

        updated_at             DATETIME      DEFAULT GETDATE(),

        -- Foreign key to UserData
        CONSTRAINT FK_UserDataTable_UserData
            FOREIGN KEY (userId) REFERENCES UserData(id)
            ON DELETE CASCADE
    );
    PRINT 'Table UserDataTable created.';
END
ELSE
BEGIN
    PRINT 'Table UserDataTable already exists.';
END
GO


-- ============================================================
-- STEP 4: TABLE — UsersCV
--   Stores saved CVs (MJML content strings) per user.
--   A user can have multiple saved CVs.
--   Referenced by: SaveCv.js, usersCVs.js, Signin.js,
--                  Register.js, deleteAccount.js
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UsersCV')
BEGIN
    CREATE TABLE UsersCV (
        id         INT           IDENTITY(1,1) PRIMARY KEY,
        userid     INT           NOT NULL,
        CVname     NVARCHAR(255),               -- user-assigned name for the CV
        CVData     NVARCHAR(MAX),               -- filled MJML template string
        saved_at   DATETIME      DEFAULT GETDATE(),

        -- Foreign key to UserData
        CONSTRAINT FK_UsersCV_UserData
            FOREIGN KEY (userid) REFERENCES UserData(id)
            ON DELETE CASCADE
    );

    -- Index to speed up lookups by userid (used in every query)
    CREATE INDEX IX_UsersCV_userid ON UsersCV(userid);

    PRINT 'Table UsersCV created.';
END
ELSE
BEGIN
    PRINT 'Table UsersCV already exists.';
END
GO


-- ============================================================
-- STEP 5: TABLE — TemplatesData
--   Stores MJML CV templates shown to the user on /Templates.
--   Referenced by: templates.js (GET), UpdateTemplate.js (GET/PUT)
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TemplatesData')
BEGIN
    CREATE TABLE TemplatesData (
        id         INT           IDENTITY(1,1) PRIMARY KEY,
        name       NVARCHAR(100) NOT NULL,       -- display name shown on template card
        content    NVARCHAR(MAX) NOT NULL        -- MJML source with {{token}} placeholders
    );
    PRINT 'Table TemplatesData created.';
END
ELSE
BEGIN
    PRINT 'Table TemplatesData already exists.';
END
GO


-- ============================================================
-- STEP 6: SEED — Insert 3 MJML CV Templates into TemplatesData
--   These use {{token}} placeholders that Templates.jsx replaces
--   with the logged-in user''s real data before rendering/saving.
--   Only inserts if table is empty so it''s safe to re-run.
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM TemplatesData)
BEGIN

    -- --------------------------------------------------------
    -- Template 1: Classic Professional (Blue & White)
    -- --------------------------------------------------------
    INSERT INTO TemplatesData (name, content) VALUES (
        'Classic Professional',
        '<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f4f4f4">

    <!-- Header -->
    <mj-section background-color="#1a3c6e" padding="30px 20px">
      <mj-column>
        <mj-text align="center" color="#ffffff" font-size="28px" font-weight="bold">
          {{username}}
        </mj-text>
        <mj-text align="center" color="#a8c4e0" font-size="14px">
          {{email}} &nbsp;|&nbsp; {{phoneNumber}} &nbsp;|&nbsp; {{location}}
        </mj-text>
        <mj-text align="center" color="#a8c4e0" font-size="13px">
          {{profileLink}}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Career Objective -->
    <mj-section background-color="#ffffff" padding="20px 30px">
      <mj-column>
        <mj-text color="#1a3c6e" font-size="16px" font-weight="bold">Career Objective</mj-text>
        <mj-divider border-color="#1a3c6e" border-width="2px" />
        <mj-text color="#444444" font-size="13px">{{careerObjective}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Education -->
    <mj-section background-color="#f9f9f9" padding="20px 30px">
      <mj-column>
        <mj-text color="#1a3c6e" font-size="16px" font-weight="bold">Education</mj-text>
        <mj-divider border-color="#1a3c6e" border-width="2px" />
        <mj-text color="#333333" font-size="14px" font-weight="bold">{{education_degree}}</mj-text>
        <mj-text color="#555555" font-size="13px">{{education_institution}} — {{education_location}}</mj-text>
        <mj-text color="#777777" font-size="13px">{{education_years}} &nbsp;|&nbsp; CGPA: {{education_cgpa}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Work Experience -->
    <mj-section background-color="#ffffff" padding="20px 30px">
      <mj-column>
        <mj-text color="#1a3c6e" font-size="16px" font-weight="bold">Work Experience</mj-text>
        <mj-divider border-color="#1a3c6e" border-width="2px" />
        <mj-text color="#333333" font-size="14px" font-weight="bold">{{work_jobTitle}}</mj-text>
        <mj-text color="#555555" font-size="13px">{{work_companyName}} — {{work_location}}</mj-text>
        <mj-text color="#777777" font-size="13px">{{work_years}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Skills -->
    <mj-section background-color="#f9f9f9" padding="20px 30px">
      <mj-column width="50%">
        <mj-text color="#1a3c6e" font-size="15px" font-weight="bold">Technical Skills</mj-text>
        <mj-text color="#444444" font-size="13px">{{skills_technical}}</mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text color="#1a3c6e" font-size="15px" font-weight="bold">Soft Skills</mj-text>
        <mj-text color="#444444" font-size="13px">{{skills_soft}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#1a3c6e" padding="12px">
      <mj-column>
        <mj-text align="center" color="#a8c4e0" font-size="11px">
          Date of Birth: {{dob}}
        </mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>'
    );

    -- --------------------------------------------------------
    -- Template 2: Modern Dark (Dark sidebar + white content)
    -- --------------------------------------------------------
    INSERT INTO TemplatesData (name, content) VALUES (
        'Modern Dark',
        '<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Georgia, serif" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#1e1e2e">

    <!-- Top Banner -->
    <mj-section background-color="#12121f" padding="35px 25px">
      <mj-column width="35%">
        <mj-text color="#e0c060" font-size="26px" font-weight="bold">{{username}}</mj-text>
        <mj-text color="#bbbbbb" font-size="13px">{{work_jobTitle}}</mj-text>
      </mj-column>
      <mj-column width="65%">
        <mj-text color="#cccccc" font-size="12px" align="right">
          📧 {{email}}<br/>
          📞 {{phoneNumber}}<br/>
          📍 {{location}}<br/>
          🔗 {{profileLink}}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Objective -->
    <mj-section background-color="#2a2a3e" padding="18px 25px">
      <mj-column>
        <mj-text color="#e0c060" font-size="15px" font-weight="bold">ABOUT ME</mj-text>
        <mj-text color="#cccccc" font-size="13px">{{careerObjective}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Education + Work side by side -->
    <mj-section background-color="#1e1e2e" padding="18px 25px">
      <mj-column width="50%">
        <mj-text color="#e0c060" font-size="15px" font-weight="bold">EDUCATION</mj-text>
        <mj-text color="#ffffff" font-size="13px" font-weight="bold">{{education_degree}}</mj-text>
        <mj-text color="#aaaaaa" font-size="12px">{{education_institution}}</mj-text>
        <mj-text color="#aaaaaa" font-size="12px">{{education_location}} | {{education_years}}</mj-text>
        <mj-text color="#aaaaaa" font-size="12px">CGPA: {{education_cgpa}}</mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text color="#e0c060" font-size="15px" font-weight="bold">EXPERIENCE</mj-text>
        <mj-text color="#ffffff" font-size="13px" font-weight="bold">{{work_jobTitle}}</mj-text>
        <mj-text color="#aaaaaa" font-size="12px">{{work_companyName}}</mj-text>
        <mj-text color="#aaaaaa" font-size="12px">{{work_location}} | {{work_years}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Skills -->
    <mj-section background-color="#2a2a3e" padding="18px 25px">
      <mj-column width="50%">
        <mj-text color="#e0c060" font-size="15px" font-weight="bold">TECHNICAL SKILLS</mj-text>
        <mj-text color="#cccccc" font-size="13px">{{skills_technical}}</mj-text>
      </mj-column>
      <mj-column width="50%">
        <mj-text color="#e0c060" font-size="15px" font-weight="bold">SOFT SKILLS</mj-text>
        <mj-text color="#cccccc" font-size="13px">{{skills_soft}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#12121f" padding="10px">
      <mj-column>
        <mj-text align="center" color="#666666" font-size="11px">DOB: {{dob}}</mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>'
    );

    -- --------------------------------------------------------
    -- Template 3: Minimalist Clean (White + Green accent)
    -- --------------------------------------------------------
    INSERT INTO TemplatesData (name, content) VALUES (
        'Minimalist Clean',
        '<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica Neue, Helvetica, Arial, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#ffffff">

    <!-- Name Block -->
    <mj-section padding="30px 40px 10px 40px">
      <mj-column>
        <mj-text color="#111111" font-size="32px" font-weight="300" letter-spacing="3px">
          {{username}}
        </mj-text>
        <mj-divider border-color="#27ae60" border-width="3px" width="60px" align="left" />
        <mj-text color="#555555" font-size="13px" padding-top="8px">
          {{email}} &nbsp;&bull;&nbsp; {{phoneNumber}} &nbsp;&bull;&nbsp; {{location}}
        </mj-text>
        <mj-text color="#27ae60" font-size="13px">{{profileLink}}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Objective -->
    <mj-section padding="10px 40px">
      <mj-column>
        <mj-text color="#27ae60" font-size="13px" font-weight="bold" letter-spacing="2px">PROFILE</mj-text>
        <mj-text color="#333333" font-size="13px">{{careerObjective}}</mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 40px">
      <mj-column>
        <mj-divider border-color="#eeeeee" border-width="1px" />
      </mj-column>
    </mj-section>

    <!-- Education -->
    <mj-section padding="10px 40px">
      <mj-column width="25%">
        <mj-text color="#27ae60" font-size="13px" font-weight="bold" letter-spacing="2px">EDUCATION</mj-text>
      </mj-column>
      <mj-column width="75%">
        <mj-text color="#111111" font-size="14px" font-weight="bold">{{education_degree}}</mj-text>
        <mj-text color="#333333" font-size="13px">{{education_institution}}, {{education_location}}</mj-text>
        <mj-text color="#888888" font-size="12px">{{education_years}} &nbsp;|&nbsp; CGPA: {{education_cgpa}}</mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 40px">
      <mj-column>
        <mj-divider border-color="#eeeeee" border-width="1px" />
      </mj-column>
    </mj-section>

    <!-- Experience -->
    <mj-section padding="10px 40px">
      <mj-column width="25%">
        <mj-text color="#27ae60" font-size="13px" font-weight="bold" letter-spacing="2px">EXPERIENCE</mj-text>
      </mj-column>
      <mj-column width="75%">
        <mj-text color="#111111" font-size="14px" font-weight="bold">{{work_jobTitle}}</mj-text>
        <mj-text color="#333333" font-size="13px">{{work_companyName}}, {{work_location}}</mj-text>
        <mj-text color="#888888" font-size="12px">{{work_years}}</mj-text>
      </mj-column>
    </mj-section>

    <mj-section padding="0 40px">
      <mj-column>
        <mj-divider border-color="#eeeeee" border-width="1px" />
      </mj-column>
    </mj-section>

    <!-- Skills -->
    <mj-section padding="10px 40px">
      <mj-column width="25%">
        <mj-text color="#27ae60" font-size="13px" font-weight="bold" letter-spacing="2px">SKILLS</mj-text>
      </mj-column>
      <mj-column width="75%">
        <mj-text color="#333333" font-size="13px">
          <strong>Technical:</strong> {{skills_technical}}
        </mj-text>
        <mj-text color="#333333" font-size="13px">
          <strong>Soft:</strong> {{skills_soft}}
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- Footer -->
    <mj-section background-color="#f8f8f8" padding="12px 40px">
      <mj-column>
        <mj-text color="#aaaaaa" font-size="11px">Date of Birth: {{dob}}</mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>'
    );

    PRINT '3 MJML templates seeded into TemplatesData.';
END
ELSE
BEGIN
    PRINT 'TemplatesData already has rows — skipping seed.';
END
GO


-- ============================================================
-- STEP 7: Verify — show all created tables
-- ============================================================
SELECT
    t.name        AS TableName,
    c.name        AS ColumnName,
    tp.name       AS DataType,
    c.max_length  AS MaxLength,
    c.is_nullable AS IsNullable,
    c.is_identity AS IsIdentity
FROM
    sys.tables t
    INNER JOIN sys.columns c  ON t.object_id = c.object_id
    INNER JOIN sys.types   tp ON c.user_type_id = tp.user_type_id
WHERE
    t.name IN ('UserData', 'UserDataTable', 'UsersCV', 'TemplatesData')
ORDER BY
    t.name, c.column_id;
GO

PRINT '=== ProfileCraft database setup complete! ===';
GO
