'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogoMark } from '@/components/Shell';
import { Button, Field, TextInput } from '@/components/ui';
import { partner } from '@/lib/data';
import { color, font, gradient } from '@/lib/theme';

type Method = 'sms' | 'app';

export function SignIn() {
  const router = useRouter();
  const [step, setStep] = useState<'credentials' | 'code'>('credentials');
  const [email, setEmail] = useState<string>(partner.email);
  const [password, setPassword] = useState('demo-password');
  const [method, setMethod] = useState<Method>('sms');
  const [code, setCode] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: gradient.page }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(148deg,#123a6e 0%,#1f5fa8 48%,#2f7fc4 100%)',
          padding: 56,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(124,201,239,.3),transparent 68%)',
          }}
        />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoMark size={38} />
          <div style={{ font: '700 19px/1 ' + font.family, letterSpacing: '-.015em', color: '#fff' }}>
            Leaze<span style={{ color: '#a9d6f5' }}>Sure</span>
            <span style={{ font: '500 12px ' + font.family, letterSpacing: '.14em', color: '#a9d6f5', marginLeft: 8 }}>PARTNERS</span>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <h1 style={{ font: '700 44px/1.1 ' + font.family, letterSpacing: '-.035em', color: '#fff', margin: '0 0 18px', maxWidth: '14ch' }}>
            Your tenants&apos; rent, on the record.
          </h1>
          <p style={{ font: '400 15.5px/1.6 ' + font.family, color: '#cfe6f9', margin: 0, maxWidth: '40ch' }}>
            Sign in to see who&apos;s reporting as paid this month, and flag anyone who isn&apos;t.
          </p>
        </div>
        <div style={{ position: 'relative', font: '500 11px/1 ' + font.family, letterSpacing: '.14em', color: '#a9d6f5' }}>
          TWO-STEP SIGN-IN REQUIRED FOR EVERY PARTNER ACCOUNT
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 56 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {step === 'credentials' ? (
            <>
              <h2 style={{ font: '700 28px/1.2 ' + font.family, letterSpacing: '-.03em', color: color.ink, margin: '0 0 8px' }}>Sign in</h2>
              <p style={{ font: '400 13.5px/1.5 ' + font.family, color: color.muted, margin: '0 0 28px' }}>
                Use the work email LeazeSure set up for your company.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <Field label="WORK EMAIL">
                  <TextInput value={email} onChange={setEmail} placeholder="you@company.ca" />
                </Field>
                <Field label="PASSWORD">
                  <TextInput value={password} onChange={setPassword} type="password" placeholder="Your password" />
                </Field>
              </div>
              <Button full size="lg" onClick={() => setStep('code')}>
                Continue
              </Button>
              <div style={{ textAlign: 'center', font: '400 12px/1.5 ' + font.family, color: color.ghost, marginTop: 20 }}>
                Not a partner yet? <a href="/">Learn about LeazeSure for property managers</a>
              </div>
            </>
          ) : (
            <div className="ls-rise">
              <h2 style={{ font: '700 28px/1.2 ' + font.family, letterSpacing: '-.03em', color: color.ink, margin: '0 0 8px' }}>One more step</h2>
              <p style={{ font: '400 13.5px/1.5 ' + font.family, color: color.muted, margin: '0 0 22px' }}>
                Anyone who can flag a tenant&apos;s rent needs two-step sign-in. Pick how you&apos;d like your code.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {([
                  ['sms', 'Text me a code'],
                  ['app', 'Use my authenticator app'],
                ] as [Method, string][]).map(([key, label]) => {
                  const on = method === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className="ls-ghost"
                      onClick={() => setMethod(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 16px',
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'left',
                        background: on ? gradient.info : gradient.card,
                        border: on ? '1.4px solid #9fc9ee' : '1px solid ' + color.line,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          flex: 'none',
                          borderRadius: '50%',
                          background: on ? 'linear-gradient(140deg,#1f5fa8,#469FE0)' : '#fff',
                          border: on ? 'none' : '1.6px solid #c2d6ea',
                        }}
                      />
                      <span style={{ font: '600 13px ' + font.family, color: color.ink }}>{label}</span>
                    </button>
                  );
                })}
              </div>
              <p style={{ font: '400 12px/1.5 ' + font.family, color: color.muted, margin: '0 0 12px' }}>
                {method === 'sms'
                  ? 'We texted a 6-digit code to ' + partner.phoneMasked + '.'
                  : 'Open your authenticator app and enter the 6-digit code for LeazeSure Partners.'}
              </p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="482 619"
                inputMode="numeric"
                style={{
                  width: '100%',
                  height: 56,
                  padding: '0 18px',
                  border: '1.4px solid #9fc9ee',
                  borderRadius: 14,
                  background: '#fff',
                  outline: 'none',
                  font: '700 22px ' + font.family,
                  letterSpacing: '.3em',
                  color: color.ink,
                  marginBottom: 22,
                }}
              />
              <Button full size="lg" onClick={() => router.push('/roll')}>
                Sign in
              </Button>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  style={{ border: 'none', background: 'none', font: '600 12px ' + font.family, color: color.brandDeep, cursor: 'pointer' }}
                >
                  Use a different account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
