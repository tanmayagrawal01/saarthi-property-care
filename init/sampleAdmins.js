const sampleAdmins = [
  {
    name: "krishna Saraswat",
    email: "krishna2005saraswat@gmail.com",
    password_hash: "$2b$10$abc123hashedpasswordexample",
    role: "superadmin",
    profile_photo_url: "",
    last_login_at: new Date("2025-06-20T10:30:00Z"),
    login_attempts: 1,
    isDeleted: false,
    status_log: [
      {
        role: "superadmin",
        changed_at: new Date("2025-01-01T09:00:00Z"),
        changed_by: null
      }
    ]
  },
  {
    name: "Tanmay Agrawal",
    email: "tanmayagrawal278@gmail.com",
    password_hash: "$2b$10$xyz456hashedpasswordexample",
    role: "superadmin",
    profile_photo_url: "",
    last_login_at: new Date("2025-06-21T14:15:00Z"),
    login_attempts: 0,
    isDeleted: false,
    status_log: [
      {
        role: "superadmin",
        changed_at: new Date("2025-03-15T12:00:00Z"),
        changed_by: null
      }
    ]
  },
  {
    name: "Khushi Prajapati",
    email: "khushikprajapati9053@gmail.com",
    password_hash: "$2b$10$def456hashedpasswordexample",
    role: "superadmin",
    profile_photo_url: "",
    last_login_at: new Date("2025-06-20T10:30:00Z"),
    login_attempts: 1,
    isDeleted: false,
    status_log: [
      {
        role: "superadmin",
        changed_at: new Date("2025-01-01T09:00:00Z"),
        changed_by: null
      }
    ]
  },
   {
    name: "Rahul Pundhir",
    email: "",
    password_hash: "$2b$10$abc456hashedpasswordexample",
    role: "superadmin",
    profile_photo_url: "",
    last_login_at: new Date("2025-06-21T14:15:00Z"),
    login_attempts: 0,
    isDeleted: false,
    status_log: [
      {
        role: "superadmin",
        changed_at: new Date("2025-03-15T12:00:00Z"),
        changed_by: null
      }
    ]
  },
];
module.exports = { data: sampleAdmins };
