import {useState, useEffect} from 'react';
import TagActions from '@/actions/tag';
import { Alert, Button } from 'reactstrap'

const Tag = () => {
    const [form, setForm] = useState({ name: ''});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: ''});
    const [tags, setTags] = useState([]);

    const loadingTags = async () => {
        let response = await TagActions.getAll();
        if(!response.error) {
            setTags(response.data.data || [])
        }
    }

    useEffect(() => {
        loadingTags();
    }, [])

    const onChangeForm = (e) => setForm({ [e.target.name]: e.target.value });
    const onSubmit = async (e) => {
        e.preventDefault();
        let name = form.name.trim();
        if(!name || name === '') { return }

        setLoading(true);

        let response = await TagActions.create({ name });
        if(response.error) {
            setStatus({ type: 'error', message: response.error.message });
        } else {
            loadingTags();
            setForm({ name: '' });
            setStatus({ type: 'success', message: "Add tag success"})
        }
        
        setLoading(false);
    } 

    const renderFormTag =  () => (
        <form onSubmit={onSubmit}>
            <div className='mt-3 mb-3'>
                <label htmlFor='name' className='form-label' >Tag Name</label>
                <input 
                    className='form-control' 
                    type='text' name='name' id='name' 
                    placeholder='Enter New Tag'
                    value={form.name}
                    onChange={onChangeForm} 
                    disabled={loading}
                />
            </div>
            <Button color="primary" disabled={loading}>Create</Button>
        </form>
    )

    const deleteTag = (tag) => async e => {
        e.preventDefault();
        let agreeDelete = window.confirm(`You want delete tag ${tag.name}`)
        if(!agreeDelete) { return }
        let response = await TagActions.delete(tag.slug);
        if(response.error) {
            setStatus({ type: 'error', message: response.error.message })
        } else {
            loadingTags();
            setStatus({ type: 'success', message: `Delete tag "${tag.name}" success`})
        }
    } 

    const renderTags = () => (
        <div className='mt-3'>
            {tags.map(tag => (
                <Button 
                    className='mb-2' 
                    color='success' 
                    style={{ marginRight: '5px' }}
                    outline
                    onDoubleClick={deleteTag(tag)}
                >
                    {tag.name}
                </Button>
            ))}
        </div>
    )

    const renderStatus = () => {
        switch(status.type) {
            case 'success': 
                return <Alert color='success'>{status.message}</Alert>
            case 'error':
                return <Alert color='danger'>{status.message}</Alert>
            default: 
                return <></>;
        }
    }

    const clearStatus = () => {
        if(!status.type) return
        setStatus({ type: null, message: '' })
    }

    return (
        <>
            { renderStatus() }
            <div onMouseMove={clearStatus}>
                { renderFormTag() }
                { renderTags() }
            </div>
        </>
    )
}

export default Tag;
