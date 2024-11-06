import { randFirstName, randLastName, randJobTitle, randSentence, randParagraph } from '@ngneat/falso'

export function toggleBg(index) {
  return index % 2 ? '#f5f5f5' : 'white'
}

export function user(index = 0) {
  const firstName = randFirstName()
  const lastName = randLastName()

  return {
    index: index + 1,
    bgColor: toggleBg(index),
    name: `${firstName} ${lastName}`,
    initials: `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`,
    jobTitle: randJobTitle(),
    description: randSentence({ length: 1 }).join(' '),
    longText: randParagraph({ length: 2 }).join('\n')
  }
}

const generated = []

export const getUser = (index) => {
  if (!generated[index]) {
    generated[index] = user(index)
  }

  return generated[index]
}

export function generateUsers(length, startIndex = 0) {
  return Array.from({ length }).map((_, i) => getUser(i + startIndex))
}

export default {
toggleBg,
user,
getUser,
generateUsers
}