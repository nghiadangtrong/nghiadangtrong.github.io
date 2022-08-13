import Link from 'next/link';
import { get as getData } from 'lodash';

export default (
  {data = [], classNameExtend = '', prefixPathname }
) => data.map(item =>
  <Link key={item._id} href={`${prefixPathname}/${item.slug}`}>
    <button className={`btn me-2 mb-2 ${classNameExtend}`}>
      {getData(item, 'name')}
    </button>
  </Link>
)
