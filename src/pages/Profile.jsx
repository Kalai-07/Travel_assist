import { useState } from 'react';
import { C }     from '../constants/theme';
import Card      from '../components/common/Card';
import StatCard  from '../components/common/StatCard';
import Btn       from '../components/common/Btn';
import Icon      from '../components/common/Icon';

const STATS = [
  { icon: 'map',        label: 'Total Trips',    value: '47',    color: 'blue'   },
  { icon: 'navigation', label: 'Km Travelled',   value: '12,340',color: 'green'  },
  { icon: 'wrench',     label: 'Services Used',  value: '23',    color: 'orange' },
  { icon: 'shield',     label: 'Safety Score',   value: '96%',   color: 'green'  },
];

const Profile = ({ user }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name:       user?.name     || '',
    email:      user?.email    || '',
    phone:      user?.phone    || '',
    vehicle:    user?.licenseNumber || '',
    model:      '',
    fuel:       '',
    insurance:  '',
  });

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const inp = {
    width:        '100%',
    padding:      '10px 14px',
    border:       `1.5px solid ${C.border}`,
    borderRadius: 10,
    fontSize:     14,
    background:   edit ? '#fff' : C.bg,
    color:        C.dark,
    marginTop:    5,
    transition:   'background .2s',
  };

  const fieldLabel = (text) => (
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {text}
    </label>
  );

  return (
    <div className="fade-in" style={{ padding: '32px 28px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.dark, marginBottom: 4 }}>My Profile</h1>
        <p style={{ color: C.muted, fontSize: 14 }}>Manage your personal info and vehicle details</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Personal info */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>Personal Information</h3>
            <Btn size="sm" variant={edit ? 'green' : 'outline'} onClick={() => setEdit((e) => !e)}>
              {edit ? '✓ Save Changes' : '✎ Edit'}
            </Btn>
          </div>

          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.green})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 30, fontFamily: 'Outfit, sans-serif', margin: '0 auto 12px', boxShadow: `0 8px 24px ${C.primary}30` }}>
              {form.name[0]}
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, color: C.dark }}>{form.name}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{form.email}</div>
          </div>

          {[
            { l: 'Full Name',      k: 'name'  },
            { l: 'Email Address',  k: 'email' },
            { l: 'Phone Number',   k: 'phone' },
          ].map((f) => (
            <div key={f.k} style={{ marginBottom: 16 }}>
              {fieldLabel(f.l)}
              <input style={inp} value={form[f.k]} onChange={handle(f.k)} readOnly={!edit} />
            </div>
          ))}
        </Card>

        {/* Vehicle info */}
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: 20 }}>Vehicle Details</h3>

          {/* Vehicle display */}
          <div style={{ background: `linear-gradient(135deg, ${C.primary}12, ${C.green}10)`, borderRadius: 14, padding: 20, marginBottom: 20, textAlign: 'center', border: `1px solid ${C.pMid}` }}>
            <Icon name="car" size={52} color={C.primary} />
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: C.dark, marginTop: 10, letterSpacing: 1 }}>
              {form.vehicle}
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>{form.model}</div>
          </div>

          {[
            { l: 'Vehicle Number', k: 'vehicle'   },
            { l: 'Model',          k: 'model'      },
            { l: 'Fuel Type',      k: 'fuel'       },
            { l: 'Insurance',      k: 'insurance'  },
          ].map((f) => (
            <div key={f.k} style={{ marginBottom: 14 }}>
              {fieldLabel(f.l)}
              <input style={inp} value={form[f.k]} onChange={handle(f.k)} readOnly={!edit} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
