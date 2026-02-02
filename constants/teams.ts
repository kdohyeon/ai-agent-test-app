import { ImageSourcePropType } from 'react-native';

export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  image: ImageSourcePropType;
}

export const TEAMS: Team[] = [
  {
    id: 'kia',
    name: 'KIA 타이거즈',
    primaryColor: '#EA0029',
    secondaryColor: '#05141F',
    image: require('@/assets/images/teams/kia.png'),
  },
  {
    id: 'samsung',
    name: '삼성 라이온즈',
    primaryColor: '#074CA1',
    secondaryColor: '#FFFFFF',
    image: require('@/assets/images/teams/samsung.png'),
  },
  {
    id: 'lg',
    name: 'LG 트윈스',
    primaryColor: '#C30452',
    secondaryColor: '#000000',
    image: require('@/assets/images/teams/lg.png'),
  },
  {
    id: 'doosan',
    name: '두산 베어스',
    primaryColor: '#131230',
    secondaryColor: '#D2282F',
    image: require('@/assets/images/teams/doosan.png'),
  },
  {
    id: 'kt',
    name: 'KT 위즈',
    primaryColor: '#000000',
    secondaryColor: '#FF0000',
    image: require('@/assets/images/teams/kt.png'),
  },
  {
    id: 'ssg',
    name: 'SSG 랜더스',
    primaryColor: '#CE0E2D',
    secondaryColor: '#FFB81C',
    image: require('@/assets/images/teams/ssg.png'),
  },
  {
    id: 'nc',
    name: 'NC 다이노스',
    primaryColor: '#315288',
    secondaryColor: '#C7A079',
    image: require('@/assets/images/teams/nc.png'),
  },
  {
    id: 'lotte',
    name: '롯데 자이언츠',
    primaryColor: '#041E42',
    secondaryColor: '#D00F31',
    image: require('@/assets/images/teams/lotte.png'),
  },
  {
    id: 'hanwha',
    name: '한화 이글스',
    primaryColor: '#F37321',
    secondaryColor: '#07111F',
    image: require('@/assets/images/teams/hanwha.png'),
  },
  {
    id: 'kiwoom',
    name: '키움 히어로즈',
    primaryColor: '#570514',
    secondaryColor: '#A1A1A4',
    image: require('@/assets/images/teams/kiwoom.png'),
  },
];
