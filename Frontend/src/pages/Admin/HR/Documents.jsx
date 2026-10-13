import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaDownload, FaEye, FaFileAlt } from 'react-icons/fa';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, AppTable } from '../../../components';
import DocumentViewerModal from '../../../components/molecules/DocumentViewerModal';
import { api } from '../../../services/api';
import { HR } from '../../../constants/hrEndpoints';
import { PAGE_SIZE, emptyPagination, normalizePagination } from '../../../constants/pagination';
import { SectionTitle, cardClass, inputClass } from './shared';

const triggerDownload = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'document';
  a.target = '_blank';
  a.rel = 'noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const Documents = ({ Layout = DefaultLayoutAdmin, Breadcrumb = BreadcrumbAdmin, admin = true }) => {
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ doc_type: 'aadhaar', title: '', user_id: '' });
  const [viewer, setViewer] = useState({ open: false, url: '', title: '', mimeType: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination());

  const load = async () => {
    try {
      const res = await api.get(`${HR.DOCUMENTS}?page=${page}&limit=${PAGE_SIZE}`);
      setRows(res.data?.data || []);
      setPagination(normalizePagination(res.data?.pagination, page, PAGE_SIZE));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load documents');
    }
  };

  useEffect(() => { load(); }, [page]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Choose a file');
      return;
    }
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('doc_type', form.doc_type);
      body.append('title', form.title || file.name);
      if (admin && form.user_id) body.append('user_id', form.user_id);

      await api.post(HR.DOCUMENTS, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Uploaded');
      setFile(null);
      setForm({ doc_type: 'aadhaar', title: '', user_id: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  const resolveDoc = async (uuid) => {
    const res = await api.get(HR.documentDownload(uuid));
    return res.data;
  };

  const viewDoc = async (doc) => {
    try {
      const data = await resolveDoc(doc.uuid);
      if (!data?.url) {
        toast.error('File not available');
        return;
      }
      setViewer({
        open: true,
        url: data.url,
        title: data.title || doc.title,
        mimeType: data.mime_type || doc.mime_type || '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to open document');
    }
  };

  const downloadDoc = async (doc) => {
    try {
      const data = await resolveDoc(doc.uuid);
      if (!data?.url) {
        toast.error('File not available');
        return;
      }
      triggerDownload(data.url, data.title || doc.title || 'document');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    }
  };

  return (
    <Layout>
      <Breadcrumb pageName="Documents" icon={FaFileAlt} backButton={false} />
      <div className={cardClass}>
        <SectionTitle title="Upload document" />
        <form onSubmit={upload} className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select className={inputClass} value={form.doc_type} onChange={(e) => setForm({ ...form, doc_type: e.target.value })}>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN</option>
            <option value="other">Other</option>
          </select>
          <input className={inputClass} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {admin && (
            <input className={inputClass} placeholder="Employee user_id (optional)" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} />
          )}
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button type="submit" className="btn-gold">Upload</button>
        </form>
      </div>

      <div className={cardClass}>
        <SectionTitle title="Documents" />
        <AppTable
          columns={[
            ...(admin
              ? [{
                  key: 'employee',
                  header: 'Employee',
                  render: (d) => d.employee?.name || d.user_id,
                }]
              : []),
            {
              key: 'doc_type',
              header: 'Type',
              render: (d) => <span className="uppercase">{d.doc_type}</span>,
            },
            { key: 'title', header: 'Title' },
          ]}
          data={rows}
          emptyText="No documents"
          currentPage={pagination.page || page}
          totalItems={pagination.totalRecords}
          totalPages={pagination.totalPages}
          itemsPerPage={PAGE_SIZE}
          onPageChange={setPage}
          actions={(d) => (
            <>
              <button type="button" className="btn-outline !flex !items-center !gap-1 !px-3 !py-1 text-sm" onClick={() => viewDoc(d)}>
                <FaEye /> View
              </button>
              <button type="button" className="btn-gold !flex !items-center !gap-1 !px-3 !py-1 text-sm" onClick={() => downloadDoc(d)}>
                <FaDownload /> Download
              </button>
            </>
          )}
        />
      </div>

      <DocumentViewerModal
        isOpen={viewer.open}
        onClose={() => setViewer({ open: false, url: '', title: '', mimeType: '' })}
        title={viewer.title}
        url={viewer.url}
        mimeType={viewer.mimeType}
        onDownload={() => triggerDownload(viewer.url, viewer.title || 'document')}
      />
    </Layout>
  );
};

export default Documents;
