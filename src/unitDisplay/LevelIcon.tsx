import iconLevel1 from 'src/data/icons/lv1.png';
import iconLevel2 from 'src/data/icons/lv2.png';
import iconLevel3 from 'src/data/icons/lv3.png';

const getLevelIcon = ({ level }: { level: number }) => {
  const icons = [iconLevel1, iconLevel2, iconLevel3];
  return icons[level - 1] || icons[0];
};

export default getLevelIcon;
