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
     { label: "Burn & Plastic Surgery", href: "/doctors?dept=Burn & Plastic Surgery" },
     { label: "Cardiology", href: "/doctors?dept=Cardiology" },
     { label: "Colorectal Surgery", href: "/doctors?dept=Colorectal Surgery" },
     { label: "Dentistry", href: "/doctors?dept=Dentistry" },
     { label: "Endocrinology", href: "/doctors?dept=Endocrinology" },
     { label: "ENT", href: "/doctors?dept=ENT" },
     { label: "General Surgery", href: "/doctors?dept=General Surgery" },
     { label: "Gynaecology", href: "/doctors?dept=Gynaecology" },
     { label: "Hepatobiliary Surgery", href: "/doctors?dept=Hepatobiliary Surgery" },
     { label: "Hepatology", href: "/doctors?dept=Hepatology" },
     { label: "Medicine", href: "/doctors?dept=Medicine" },
     { label: "Laparoscopic Surgery", href: "/doctors?dept=Laparoscopic Surgery" },
     { label: "Nephrology", href: "/doctors?dept=Nephrology" },
     { label: "Neurology", href: "/doctors?dept=Neurology" },
     { label: "Neurosurgery", href: "/doctors?dept=Neurosurgery" },
     { label: "Oncology", href: "/doctors?dept=Oncology" },
     { label: "Orthopaedics", href: "/doctors?dept=Orthopaedics" },
     { label: "Pediatrics", href: "/doctors?dept=Pediatrics" },
     { label: "Physical Medicine", href: "/doctors?dept=Physical Medicine" },
     { label: "Psychiatry", href: "/doctors?dept=Psychiatry" },
     { label: "Respiratory Medicine", href: "/doctors?dept=Respiratory Medicine" },
     { label: "Rheumatology", href: "/doctors?dept=Rheumatology" },
     { label: "Skin & VD", href: "/doctors?dept=Skin & VD" },
     { label: "Surgical Oncology", href: "/doctors?dept=Surgical Oncology" },
     { label: "Urology", href: "/doctors?dept=Urology" },

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