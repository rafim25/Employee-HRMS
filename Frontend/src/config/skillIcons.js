import { 
  FaReact, 
  FaNode, 
  FaPython, 
  FaJava, 
  FaDatabase,
  FaAws,
  FaDocker,
  FaCss3,
  FaHtml5,
  FaJs,
  FaBriefcase
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiSpring, 
  SiKubernetes, 
  SiTensorflow,
  SiAngular
} from 'react-icons/si';

export const skillIcons = {
  'React': { icon: FaReact, color: 'text-[#61DAFB] bg-[#61DAFB]/10' },
  'Node.js': { icon: FaNode, color: 'text-[#339933] bg-[#339933]/10' },
  'Python': { icon: FaPython, color: 'text-[#3776AB] bg-[#3776AB]/10' },
  'Java': { icon: FaJava, color: 'text-[#007396] bg-[#007396]/10' },
  'SQL': { icon: FaDatabase, color: 'text-[#4479A1] bg-[#4479A1]/10' },
  'AWS': { icon: FaAws, color: 'text-[#FF9900] bg-[#FF9900]/10' },
  'Docker': { icon: FaDocker, color: 'text-[#2496ED] bg-[#2496ED]/10' },
  'TypeScript': { icon: SiTypescript, color: 'text-[#3178C6] bg-[#3178C6]/10' },
  'Spring': { icon: SiSpring, color: 'text-[#6DB33F] bg-[#6DB33F]/10' },
  'Kubernetes': { icon: SiKubernetes, color: 'text-[#326CE5] bg-[#326CE5]/10' },
  'CSS': { icon: FaCss3, color: 'text-[#1572B6] bg-[#1572B6]/10' },
  'HTML': { icon: FaHtml5, color: 'text-[#E34F26] bg-[#E34F26]/10' },
  'JavaScript': { icon: FaJs, color: 'text-[#F7DF1E] bg-[#F7DF1E]/10' },
  'Angular': { icon: SiAngular, color: 'text-[#DD0031] bg-[#DD0031]/10' },
  'TensorFlow': { icon: SiTensorflow, color: 'text-[#FF6F00] bg-[#FF6F00]/10' }
};

export const getSkillIcon = (skill) => {
  const defaultStyle = 'text-primary bg-primary/10';
  const skillConfig = skillIcons[skill] || { 
    icon: FaBriefcase, 
    color: defaultStyle 
  };
  return skillConfig;
}; 