// Mets ici les IDs autorisés (utilisateurs ou rôles)
export const ALLOWED_USERS = ['530757472336478230','293460575818743809']
export const ALLOWED_ROLES = []

export function isAllowed(message) {
  const isAllowedUser = ALLOWED_USERS.includes(message.author.id)
  const isAllowedRole = message.member && message.member.roles.cache.some(role => ALLOWED_ROLES.includes(role.id))
  return isAllowedUser || isAllowedRole
} 