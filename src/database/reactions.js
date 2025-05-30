import fs from 'fs'
const FILE = './reactions.json'
let userReactions = {}

function save() {
  fs.writeFileSync(FILE, JSON.stringify(userReactions, null, 2))
}

function load() {
  if (fs.existsSync(FILE)) {
    userReactions = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
  }
}

load()

export function setReactions(userId, reactions) {
  userReactions[userId] = reactions
  save()
}

export function getReactions(userId) {
  return userReactions[userId] || []
}

export function removeReactions(userId) {
  delete userReactions[userId]
  save()
} 