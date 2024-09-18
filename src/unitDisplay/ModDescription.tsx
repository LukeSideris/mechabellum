import { ModInterface } from 'src/data/mods.ts';
import classes from './ModDescription.module.css';

// mod description display and semantics used in tooltips
const ModDescription = ({ mod }: { mod: ModInterface }) => (
  <p className={classes.modDescription}>
    <dfn>{mod.name}</dfn> {mod.description}
  </p>
);

export default ModDescription;
