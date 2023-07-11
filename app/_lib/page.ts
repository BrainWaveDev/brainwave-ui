function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  element?.scrollIntoView({ behavior: 'smooth' });
}

export { scrollToElement };
