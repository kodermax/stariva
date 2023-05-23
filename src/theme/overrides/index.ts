import { Theme } from '@mui/material/styles';

//
import Fab from './Fab';
import Card from './Card';
import Tabs from './Tabs';
import Menu from './Menu';
import Link from './Link';
import Lists from './List';
import Table from './Table';
import Badge from './Badge';
import Paper from './Paper';
import Input from './Input';
import Drawer from './Drawer';
import Dialog from './Dialog';
import Avatar from './Avatar';
import Slider from './Slider';
import Button from './Button';
import Switch from './Switch';
import SvgIcon from './SvgIcon';
import Tooltip from './Tooltip';
import Popover from './Popover';
import Stepper from './Stepper';
import DataGrid from './DataGrid';
import Skeleton from './Skeleton';
import Backdrop from './Backdrop';
import Progress from './Progress';
import Timeline from './Timeline';
import TreeView from './TreeView';
import Checkbox from './Checkbox';
import Accordion from './Accordion';
import DatePicker from './DatePicker';
import Typography from './Typography';
import Pagination from './Pagination';
import Breadcrumbs from './Breadcrumbs';
import Autocomplete from './Autocomplete';
import ToggleButton from './ToggleButton';
import ControlLabel from './ControlLabel';
import LoadingButton from './LoadingButton';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    Fab(theme),
    Tabs(theme),
    Card(theme),
    Menu(theme),
    Link(),
    Input(theme),
    Badge(),
    Lists(theme),
    Table(theme),
    Paper(),
    Switch(theme),
    Button(theme),
    Dialog(theme),
    Avatar(theme),
    Slider(theme),
    Drawer(theme),
    Stepper(theme),
    Tooltip(theme),
    Popover(theme),
    SvgIcon(),
    Checkbox(theme),
    DataGrid(theme),
    Skeleton(theme),
    Timeline(theme),
    TreeView(theme),
    Backdrop(theme),
    Progress(theme),
    Accordion(theme),
    DatePicker(),
    Typography(theme),
    Pagination(theme),
    Breadcrumbs(theme),
    Autocomplete(theme),
    ControlLabel(theme),
    ToggleButton(theme),
    LoadingButton()
  );
}
