export interface NavbarLink {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  companyName: string;
  links: NavbarLink[];
  className?: string;
  onLogoClick?: () => void;
  onLinkClick?: (link: NavbarLink) => void;
}
