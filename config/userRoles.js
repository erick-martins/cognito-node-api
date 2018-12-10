const fullPermissions = {
  user: {
    "create_admin": true,
    "create_super_admin": true,
    "create_attendant": true,
    "delete_admin": true,
    "delete_super_admin": true,
    "delete_attendant": true,
    "update_admin": true,
    "update_super_admin": true,
    "update_attendant": true
  },
  post: {
    "write": true,
    "be_author": true,
    "publish": true,
    "delete_own_post": true,
    "edit_own_post": true,
    "approve_posts": true,
    "delete_others_post": true,
    "edit_others_post": true,
    "approve_posts": true,
  }
}

module.exports = [{
  name: "super_admin",
  permissions: fullPermissions,
  access: ["admin_panel", "attendant_panel", "frontend_panel"]
}, {
  name: "admin",
  permissions: [],
  access: ["admin_panel", "attendant_panel", "frontend_panel"]
}];