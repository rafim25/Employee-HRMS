import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPlus, FaRegEdit, FaTimes } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import { api } from '../../../../services/api';

const BULK_PLACEHOLDER = `1. Himachal Pradesh
Amb Industrial Area, Arki, Baddi, Shimla, Solan.

2. Jammu & Kashmir
Achabal, Anantnag, Jammu, Srinagar.

3. Jharkhand
AEC Complex, Ara, Ranchi.`;

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [bulkText, setBulkText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editState, setEditState] = useState('');
  const [editCities, setEditCities] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const bustLocationCaches = () => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('location_'))
      .forEach((key) => localStorage.removeItem(key));
  };

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/locations/manage');
      setLocations(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const openCreateForm = () => {
    setEditingId(null);
    setEditState('');
    setEditCities('');
    setShowForm(true);
  };

  const openEditForm = (location) => {
    setEditingId(location.id);
    setEditState(location.name || '');
    setEditCities(location.cityNames || (location.cities || []).map((city) => city.name).join(', '));
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingId(null);
    setEditState('');
    setEditCities('');
    setShowForm(true);
  };

  const handleBulkSubmit = async (event) => {
    event.preventDefault();
    if (!bulkText.trim()) {
      toast.error('Paste one or more numbered state blocks');
      return;
    }

    setSaving(true);
    try {
      const response = await api.post('/api/locations/manage/bulk', { text: bulkText });
      const { created = [], skipped = [] } = response.data || {};
      bustLocationCaches();
      setBulkText('');
      await loadLocations();

      if (created.length && skipped.length) {
        toast.success(`Added ${created.length}, skipped ${skipped.length} existing`);
      } else if (created.length) {
        toast.success(`Added ${created.length} state(s)`);
      } else if (skipped.length) {
        toast.success(`All ${skipped.length} state(s) already exist — skipped`);
      } else {
        toast.success(response.data?.message || 'Done');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save locations');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const state = editState.trim();
    const cities = editCities.trim();

    if (!state) {
      toast.error('State name is required');
      return;
    }
    if (!cities) {
      toast.error('Enter at least one city, separated by commas');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/locations/manage/${editingId}`, { state, cities });
      toast.success('Location updated');
      bustLocationCaches();
      closeForm();
      await loadLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update location');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/locations/manage/${locationToDelete}`);
      toast.success('Location deleted');
      bustLocationCaches();
      await loadLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete location');
    } finally {
      setShowDeleteModal(false);
      setLocationToDelete(null);
    }
  };

  const filtered = locations.filter((location) => {
    const query = searchTerm.toLowerCase();
    return (
      location.name?.toLowerCase().includes(query) ||
      location.code?.toLowerCase().includes(query) ||
      location.cityNames?.toLowerCase().includes(query)
    );
  });

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Locations" icon={FaMapMarkerAlt} backButton={false} />

      <div className="app-card mb-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <ButtonOne type="button" onClick={openCreateForm}>
              <FaPlus />
              Bulk Add States
            </ButtonOne>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search states or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 pl-12 pr-4 outline-none focus:border-[#d4af37]"
            />
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#0b1d36]/50" />
          </div>
        </div>
      </div>

      {showForm && !editingId && (
        <div className="app-card mb-6 p-6">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Bulk import
            </p>
            <h3 className="text-xl font-semibold text-[#0b1d36]">
              Paste states and cities in one box
            </h3>
          </div>

          <form onSubmit={handleBulkSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0b1d36]">
                States &amp; cities <span className="text-danger">*</span>
              </label>
              <textarea
                rows={14}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={BULK_PLACEHOLDER}
                className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 px-4 font-mono text-sm outline-none focus:border-[#d4af37]"
              />
              <p className="mt-2 text-sm text-[#0b1d36]/60">
                Format: numbered state on its own line, then comma-separated cities on the next line(s).
                Existing states are skipped automatically.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className={`btn-gold ${saving ? 'opacity-50' : ''}`}>
                {saving ? 'Saving...' : 'Save all'}
              </button>
              <button
                type="button"
                onClick={() => setBulkText('')}
                className="btn-outline"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {showForm && editingId && (
        <div className="app-card mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Edit
              </p>
              <h3 className="text-xl font-semibold text-[#0b1d36]">Update state and cities</h3>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1d36]/5 text-[#0b1d36] hover:bg-[#0b1d36] hover:text-white"
              aria-label="Close form"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0b1d36]">
                State <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editState}
                onChange={(e) => setEditState(e.target.value)}
                className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 px-4 outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0b1d36]">
                Cities <span className="text-danger">*</span>
              </label>
              <textarea
                rows={4}
                value={editCities}
                onChange={(e) => setEditCities(e.target.value)}
                className="w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-3 px-4 outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={saving} className={`btn-gold ${saving ? 'opacity-50' : ''}`}>
                {saving ? 'Saving...' : 'Update'}
              </button>
              <button type="button" onClick={closeForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="app-card overflow-hidden">
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#0b1d36]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Code</th>
                  <th className="px-4 py-3 text-left">Cities</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[#0b1d36]/60">
                      No locations yet. Paste numbered state blocks above to get started.
                    </td>
                  </tr>
                ) : (
                  filtered.map((location) => (
                    <tr key={location.id} className="border-t border-[rgba(11,29,54,0.08)]">
                      <td className="px-4 py-3 font-medium text-[#0b1d36]">{location.name}</td>
                      <td className="px-4 py-3 text-[#0b1d36]/70">{location.code}</td>
                      <td className="px-4 py-3 text-[#0b1d36]/80">
                        {location.cityNames || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(location)}
                            className="text-primary hover:opacity-80"
                            aria-label={`Edit ${location.name}`}
                          >
                            <FaRegEdit className="text-xl" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLocationToDelete(location.id);
                              setShowDeleteModal(true);
                            }}
                            className="text-danger hover:opacity-80"
                            aria-label={`Delete ${location.name}`}
                          >
                            <BsTrash3 className="text-xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setLocationToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Location"
          message="Delete this state and all of its cities? This cannot be undone."
        />
      )}
    </DefaultLayoutAdmin>
  );
};

export default Locations;
