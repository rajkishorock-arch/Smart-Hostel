import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Announcement } from '../../types';
import {
  subscribeAnnouncements,
  saveAnnouncement,
  deleteAnnouncement
} from '../../services/storageService';
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  X
} from 'lucide-react';

export const MessAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Mess' | 'Hostel' | 'Maintenance' | 'General'>('Mess');
  const [published, setPublished] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Warden subscribes to all announcements (published + draft)
    const unsub = subscribeAnnouncements(list => setAnnouncements(list), false);
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Mess');
    setPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setPublished(ann.published);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: editingId || `ann-${Date.now()}`,
      title,
      content,
      category,
      published,
      createdAt: editingId
        ? announcements.find(a => a.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      author: 'Warden Mess Committee'
    };

    await saveAnnouncement(newAnn);
    setIsModalOpen(false);
    setFeedback(`Announcement "${title}" ${editingId ? 'updated' : 'created'} successfully!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
      setFeedback('Announcement deleted.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const togglePublish = async (ann: Announcement) => {
    const updated = { ...ann, published: !ann.published };
    await saveAnnouncement(updated);
    setFeedback(`Announcement marked as ${updated.published ? 'Published' : 'Draft (Hidden from residents)'}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Smart Mess Management', href: '/admin/mess' },
        { label: 'Announcements Board' }
      ]}
    >
      {/* Top Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--mess-accent)',
                background: 'var(--brand-green-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Megaphone size={14} /> Broadcast Cell
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Mess & Campus Announcements
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Broadcast meal menu updates, festive dinners, water supply notices, and operational announcements to residents.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--mess-accent)',
            color: '#ffffff',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {announcements.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--neutral-border)',
              color: 'var(--neutral-muted)'
            }}
          >
            No announcements created yet. Click "New Announcement" to publish one.
          </div>
        ) : (
          announcements.map(ann => (
            <div
              key={ann.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-border)',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--brand-green-subtle)',
                      color: 'var(--mess-accent)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {ann.category}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: ann.published ? '#dcfce7' : '#f1f5f9',
                      color: ann.published ? '#15803d' : '#64748b'
                    }}
                  >
                    {ann.published ? '● Published (Visible to Residents)' : '○ Draft (Hidden)'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => togglePublish(ann)}
                    title={ann.published ? 'Unpublish' : 'Publish'}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--neutral-border)',
                      background: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {ann.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    {ann.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => openEditModal(ann)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--neutral-border)',
                      background: '#ffffff',
                      color: 'var(--neutral-dark)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(ann.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #fee2e2',
                      background: '#fff1f2',
                      color: '#dc2626',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '0 0 8px 0' }}>
                {ann.title}
              </h2>

              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                {ann.content}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                Published by {ann.author} • {new Date(ann.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                  Announcement Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Festive Dinner & Extended Timings"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.85rem', background: '#ffffff' }}
                  >
                    <option value="Mess">Mess & Dining</option>
                    <option value="Hostel">Hostel Accommodation</option>
                    <option value="Maintenance">Maintenance & Utilities</option>
                    <option value="General">General Notice</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                    Publication State:
                  </label>
                  <select
                    value={published ? 'true' : 'false'}
                    onChange={e => setPublished(e.target.value === 'true')}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.85rem', background: '#ffffff' }}
                  >
                    <option value="true">Publish Immediately</option>
                    <option value="false">Save as Draft (Private)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)', marginBottom: '6px' }}>
                  Detailed Notice Content:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the schedule change, event, or alert for residents..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--neutral-border)', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid var(--neutral-border)', background: '#ffffff', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: 'var(--mess-accent)', color: '#ffffff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingId ? 'Update Notice' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
