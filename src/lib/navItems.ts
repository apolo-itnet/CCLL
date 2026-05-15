export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  grid?: boolean;
  branches?: boolean;
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About CCLL", href: "/about" },
      { label: "Our History", href: "/about/history" },
      { label: "From MD's Desk", href: "/about/mds-desk" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
      { label: "Industry Recognitions", href: "/about/recognitions" },
    ],
  },
  {
    label: "Range of Services",
    href: "/services",
    children: [
      { label: "Pathology", href: "/services/pathology" },
      { label: "Radiology & Imaging", href: "/services/radiology" },
      { label: "Cardiology", href: "/services/cardiology" },
      { label: "Ear Nose & Throat (ENT)", href: "/services/ent" },
      { label: "Gastroenterology", href: "/services/gastroenterology" },
      { label: "Neurophysiology", href: "/services/neurophysiology" },
      { label: "Ultrasonography", href: "/services/ultrasonography" },
    ],
  },
  {
    label: "Doctors",
    href: "/doctors",
    grid: true,
    children: [
      { label: "Medicine", href: "/doctors?dept=Medicine" },
      { label: "Surgery", href: "/doctors?dept=Surgery" },
      { label: "Pediatric Surgery", href: "/doctors?dept=Pediatric Surgery" },
      { label: "Burn & Plastic Surgery", href: "/doctors?dept=Burn & Plastic Surgery" },
      { label: "Neurosurgery", href: "/doctors?dept=Neurosurgery" },
      { label: "Cardiac & Medicine", href: "/doctors?dept=Cardiac & Medicine" },
      { label: "Orthopedic", href: "/doctors?dept=Orthopedic" },
      { label: "ENT", href: "/doctors?dept=ENT" },
      { label: "Cancer", href: "/doctors?dept=Cancer" },
      { label: "Psychiatry", href: "/doctors?dept=Psychiatry" },
      { label: "Gynae & Obs", href: "/doctors?dept=Gynae & Obs" },
      { label: "Paediatric", href: "/doctors?dept=Paediatric" },
      { label: "Kidney", href: "/doctors?dept=Kidney" },
      { label: "Neuromedicine", href: "/doctors?dept=Neuromedicine" },
      { label: "Dental", href: "/doctors?dept=Dental" },
      { label: "Skin & VD", href: "/doctors?dept=Skin & VD" },
    ],
  },
  {
    label: "Our Units",
    href: "/units",
    children: [
      { label: "Specialized Hospital", href: "/units/specialized-hospital" },
      { label: "Eye Hospital", href: "/units/eye-hospital" },
      { label: "Oro Dental Clinic", href: "/units/oro-dental" },
      { label: "IVF Center", href: "/units/ivf-center" },
    ],
  },
  {
    label: "Our Branches",
    href: "/branches",
    branches: true,
    children: [
      { label: "Halisahar", href: "/branches/halisahar" },
      { label: "Bondortila", href: "/branches/bondortila" },
      { label: "Anowara", href: "/branches/anowara" },
      { label: "Potiya", href: "/branches/potiya" },
      { label: "Boalkhali", href: "/branches/boalkhali" },
      { label: "Chokoria", href: "/branches/chokoria" },
      { label: "Cox's Bazar", href: "/branches/coxs-bazar" },
      { label: "Hathazari", href: "/branches/hathazari" },
      { label: "Nazirhat", href: "/branches/nazirhat" },
      { label: "Rangamati", href: "/branches/rangamati" },
      { label: "Feni", href: "/branches/feni" },
    ],
  },
  { label: "Contact", href: "/contact" },
];