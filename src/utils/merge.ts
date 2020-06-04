// Quick and data array merge, copy and pasted from https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key
export default (arr1, arr2) => {
  const merged = [];

  for (let i = 0; i < arr1.length; i++) {
    merged.push({
      ...arr1[i],
      ...arr2.find((itmInner) => itmInner.id === arr1[i].id),
    });
  }

  return merged;
};
