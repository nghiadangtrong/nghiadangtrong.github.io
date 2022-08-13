import AdminLayout from '@/components/Layout/Admin'
import Category from '@/components/Category';
import Tag from '@/components/Tag';

const CategoriesTags = () => {

    return (
        <AdminLayout>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                        <Category />
                    </div>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                        <Tag/>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default CategoriesTags;
