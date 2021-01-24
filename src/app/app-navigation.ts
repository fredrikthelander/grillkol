import { faCog } from '@fortawesome/pro-light-svg-icons/faCog';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { faList } from '@fortawesome/pro-light-svg-icons/faList';
import { faTasks } from '@fortawesome/pro-light-svg-icons/faTasks';
import { faChartPie } from '@fortawesome/pro-light-svg-icons/faChartPie';
import { faUser } from '@fortawesome/pro-light-svg-icons/faUser';

export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: faSvg(faHome)
  },
  //},
  //{
  //  text: 'Examples',
  //  icon: 'folder',
  //  items: [
  //    {
  //      text: 'Profile',
  //      path: '/profile'
  //    },
  //    {
  //      text: 'Tasks',
  //      path: '/tasks'
  //    }
  //  ]
  //}
  {
    text: 'Projekt',
    path: '/projects',
    icon: faSvg(faTasks)
  },
  {
    text: 'Säljare',
    path: '/salespersons',
    icon: faSvg(faUser)
  },
  {
    text: 'Ordrar',
    path: '/orders',
    icon: faSvg(faList)
  },
  {
    text: 'Rapporter',
    path: '/reports',
    icon: faSvg(faChartPie),
  },
  {
    text: 'Inställningar',
    icon: faSvg(faCog),
    items: [
      { text: 'Allmänt ', path: '/settings/general' },
      { text: 'Produkter ', path: '/settings/products' },
      { text: 'Kategorier ', path: '/settings/categories' },
      { text: 'Swish', path: '/settings/swish' },
      { text: 'Fortnox', path: '/settings/fortnox' },
      { text: 'Moms', path: '/settings/vats' },
      { text: 'Användare', path: '/settings/users' }
    ]
  }
];

export function faSvg(fa) {
  return `<svg width="1em" height="1em" viewBox="0 0 ${fa.icon[0]} ${fa.icon[1]}" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="${fa.icon[4]}"/></svg>`
}
