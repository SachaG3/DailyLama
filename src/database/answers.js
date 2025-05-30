import fs from 'fs'
const FILE = './answers.json'
let userAnswers = {}
let globalAnswers = []

function save() {
  fs.writeFileSync(FILE, JSON.stringify({ userAnswers, globalAnswers }, null, 2))
}

function load() {
  if (fs.existsSync(FILE)) {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'))
    userAnswers = data.userAnswers || {}
    globalAnswers = data.globalAnswers || []
  }
}

function nextGlobalId() {
  let max = 0
  for (const rule of globalAnswers) {
    if (rule.id && rule.id.startsWith('g')) {
      const n = parseInt(rule.id.slice(1))
      if (n > max) max = n
    }
  }
  return 'g' + (max + 1)
}

load()

export function setAnswer(userId, answer, mode = 'all', word = '') {
  if (userId === 'global') {
    const id = nextGlobalId()
    globalAnswers.push({ id, answer, mode, word })
  } else {
    userAnswers[userId] = { answer, mode, word }
  }
  save()
}

export function getAnswer(userId) {
  return userAnswers[userId] || null
}

export function removeAnswer(userIdOrGlobalId) {
  if (userIdOrGlobalId === 'global') {
    globalAnswers = []
  } else if (userIdOrGlobalId.startsWith('g')) {
    globalAnswers = globalAnswers.filter(rule => rule.id !== userIdOrGlobalId)
  } else {
    delete userAnswers[userIdOrGlobalId]
  }
  save()
}

export function getAllAnswers() {
  return { userAnswers, globalAnswers }
}

export function getGlobalAnswers() {
  return globalAnswers
} 