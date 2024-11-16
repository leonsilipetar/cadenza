export const NavItem = ({ href, children }) => {
  return (
    <a 
      href={href}
      role="menuitem"
      tabIndex="0"
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
    >
      {children}
    </a>
  );
}; 