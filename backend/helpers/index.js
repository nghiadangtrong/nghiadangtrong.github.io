const smartTrim = (content, maxLength, moreString = '...') => {
  if(maxLength >= content.length) {
    return content;
  }
  let newContent = content.substring(0, maxLength + 1);

  let lastSpaceNewContent = newContent.lastIndexOf(' ');
  if(lastSpaceNewContent > 0) {
    newContent = newContent.substring(0, lastSpaceNewContent);
  }
  return  newContent.trim() + moreString
}

module.exports = {
  smartTrim
}
