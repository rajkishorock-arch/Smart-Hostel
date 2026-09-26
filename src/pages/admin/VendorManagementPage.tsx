import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { subscribeVendors } from '../../services/storageService';
import { VendorRecord } from '../../types';
import {
  Truck,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  PlusCircle,
  FileText,
  Clock,
  Search,
  Check
} from 'lucide-react';

export const VendorManagementPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [poSuccessMsg, setPoSuccessMsg] = useState<string | null>(null);

  // New Purchase Order Modal
  const [activeVendorForPO, setActiveVendorForPO] = useState<VendorRecord | null>(null);
  const [poDescription, setPoDescription] = useState('');
  const [poAmount, setPoAmount] = useState('');

  useEffect(() => {
    const unsub = subscribeVendors(v => setVendors(v));
    return () => unsub();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreatePO = () => {
    if (!activeVendorForPO) return;
    setVendors(prev => prev.map(v => {
      if (v.id === activeVendorForPO.id) {
        return { ...v, pendingOrdersCount: v.pendingOrdersCount + 1 };
      }
      return v;
    }));

    setPoSuccessMsg(`Purchase Order for ₹${Number(poAmount || 15000).toLocaleString()} issued to ${activeVendorForPO.name}!`);
    setActiveVendorForPO(null);
    setPoDescription('');
    setPoAmount('');
    setTimeout(() => setPoSuccessMsg(null), 4000);
  };

  return (
    <AppLayout
      activeDomain="mess"
      breadcrumbs={[
        { label: 'Campus Operations', href: '/admin/dashboard' },
        { label: 'Vendor & Supply Chain' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Vendor &amp; Supply Chain Management
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Contracted catering suppliers, hardware vendors, delivery timeliness, and purchase order tracking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Active Contracts: <strong>{vendors.filter(v => v.activeContract).length} Vendors</strong>
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {poSuccessMsg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{poSuccessMsg}</span>
          </div>
        )}

        {/* Search & Category Filter */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', minWidth: '260px', flex: 1 }}>
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search vendors by name or contact person..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Groceries & Provisions', 'Dairy & Fresh Produce', 'Plumbing & Hardware', 'Electrical Supplies'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--brand-purple)' : '#f1f5f9',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredVendors.map(vendor => (
            <div
              key={vendor.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {vendor.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Star size={13} fill="#b45309" color="#b45309" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {vendor.name}
                </h3>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Contact: <strong>{vendor.contactPerson}</strong> &bull; {vendor.phone}
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Last Delivery:</strong> {vendor.lastDeliveryDate} &bull; <strong>Terms:</strong> {vendor.paymentTerms}
                  </div>
                  <div>
                    <strong>Active POs in Pipeline:</strong> <span style={{ color: vendor.pendingOrdersCount > 0 ? '#16a34a' : 'var(--text-muted)', fontWeight: 700 }}>{vendor.pendingOrdersCount} orders</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Contract Active
                </span>

                <button
                  type="button"
                  onClick={() => setActiveVendorForPO(vendor)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--brand-purple)',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle size={14} />
                  <span>Issue Purchase Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Issue Purchase Order */}
        {activeVendorForPO && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(3px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setActiveVendorForPO(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                Issue Purchase Order
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Vendor: <strong>{activeVendorForPO.name}</strong> ({activeVendorForPO.category})
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Item Specifications / Supplies Description:</label>
                <textarea
                  rows={3}
                  placeholder="e.g. 50 kg Basmati Rice, 20 L Refined Sunflower Oil, Fresh Paneer batch"
                  value={poDescription}
                  onChange={e => setPoDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Estimated Order Value (₹ INR):</label>
                <input
                  type="number"
                  placeholder="e.g. 18500"
                  value={poAmount}
                  onChange={e => setPoAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '0.825rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setActiveVendorForPO(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#ffffff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePO}
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'var(--brand-purple)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm &amp; Transmit PO
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
