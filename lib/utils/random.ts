/**
 * Get a random item from an array, optionally excluding a specific item
 * to prevent duplicate selections
 */
export function getRandomItem<T>(items: T[], exclude?: T): T {
  let options = items
  
  // If we have an item to exclude and more than one option, filter it out
  if (exclude && items.length > 1) {
    options = items.filter((item) => item !== exclude)
  }
  
  const randomIndex = Math.floor(Math.random() * options.length)
  return options[randomIndex]
}
