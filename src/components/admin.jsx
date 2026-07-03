import React, { useState, useEffect, useCallback } from 'react';
import { Search, Check, X, Eye, Edit, Trash2, RefreshCw, Mail, Clock, CheckCircle, XCircle, LogOut, Lock, Menu } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import QRCode from 'qrcode';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const TEMPLATE_USER = process.env.REACT_APP_EMAILJS_TEMPLATE_USER;
// ========================================
// SEND MEMBERSHIP ACTIVATION EMAIL
// ========================================


// ========================================
// SEND MEMBERSHIP ACTIVATION EMAIL
// ========================================
const sendMembershipActivationEmail = async (submission, expiryDate) => {
  try {
    const templateParams = {
      to_email: submission.email,
      email_subject: 'Your Impact360 Membership is Active',
      welcome_message: `
        <div style="padding: 40px 30px; background-color: #F8F9FA; border-radius: 15px; margin-bottom: 30px; border-left: 5px solid #306CEC;">
          <h2 style="color: #306CEC; margin: 0 0 25px 0; font-size: 26px; font-weight: bold;">Welcome, ${submission.fullName}</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 18px 0;">
            Your Impact360 membership is now <strong>active</strong>! You now have access to exclusive member benefits, events, and resources.
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
            <strong>Membership Expiry Date:</strong> <span style="color: #306CEC;">${expiryDate}</span>
          </p>
          <p style="color: #306CEC; font-size: 17px; font-weight: bold; margin: 0;">
            — Impact360 Team
          </p>
        </div>
      `,
      additional_info: `
        <div style="background-color: #E3FCEC; padding: 30px; border-radius: 12px; border-left: 5px solid #28a745;">
          <h3 style="color: #28a745; margin: 0 0 18px 0; font-size: 22px; font-weight: bold;">Membership Details</h3>
          <ul style="color: #155724; font-size: 16px; line-height: 2;">
            <li><strong>Name:</strong> ${submission.fullName}</li>
            <li><strong>Email:</strong> ${submission.email}</li>
            <li><strong>Plan:</strong> ${submission.planName} (${submission.planPeriod})</li>
            <li><strong>Amount:</strong> KES ${submission.amount}</li>
            <li><strong>Expiry Date:</strong> ${expiryDate}</li>
          </ul>
        </div>
      `
    };
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_USER,
      templateParams
    );
    console.log('✅ Membership activation email sent');
    return true;
  } catch (error) {
    console.error('❌ Failed to send membership activation email:', error);
    return false;
  }
};

// All imports moved to the top to satisfy ESLint import/first rule


// ========================================
// EMAILJS CONFIGURATION - UPDATE THESE!
// ========================================

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [planFilter, setPlanFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [notification, setNotification] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [roadshowRegs, setRoadshowRegs] = useState([]);
  const [selectedRoadshowReg, setSelectedRoadshowReg] = useState(null);
  const [activeSection, setActiveSection] = useState('subscriptions');
  const [roadshowCityFilter, setRoadshowCityFilter] = useState('all');
  const [roadshowView, setRoadshowView] = useState('registrations');
  const [roadshowSearch, setRoadshowSearch] = useState('');
  const [localTierFilter, setLocalTierFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [regToDelete, setRegToDelete] = useState(null);

  const deleteRoadshowReg = async () => {
    if (!regToDelete) return;
    try {
      await deleteDoc(doc(db, 'roadshowRegistrations', regToDelete.id));
      if (selectedRoadshowReg?.id === regToDelete.id) setSelectedRoadshowReg(null);
      showNotification(`Deleted registration for ${regToDelete.name}`, 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification('Failed to delete registration', 'error');
    } finally {
      setRegToDelete(null);
    }
  };

  const toggleInviteSent = async (reg) => {
    try {
      await updateDoc(doc(db, 'roadshowRegistrations', reg.id), { inviteSent: true });
    } catch (err) {
      showNotification('Failed to update invite status', 'error');
    }
  };


  const toggleAttended = async (reg) => {
    try {
      await updateDoc(doc(db, 'roadshowRegistrations', reg.id), { attended: !reg.attended });
    } catch (err) {
      showNotification('Failed to update attendance', 'error');
    }
  };

  const resetAllInviteSent = async () => {
    const marked = roadshowRegs.filter(r => r.inviteSent);
    if (marked.length === 0) { showNotification('Nothing to reset', 'error'); return; }
    await Promise.all(marked.map(r => updateDoc(doc(db, 'roadshowRegistrations', r.id), { inviteSent: false })));
    showNotification('All invite marks reset', 'success');
  };

  const clearAllRoadshowRegs = async () => {
    setClearing(true);
    try {
      const snap = await getDocs(collection(db, 'roadshowRegistrations'));
      await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'roadshowRegistrations', d.id))));
      setSelectedRoadshowReg(null);
    } catch (err) {
      console.error('Clear failed:', err);
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  };

  // Fetch newsletter subscribers
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchSubscribers = async () => {
      try {
        const q = query(collection(db, "newsletterSubscribers"));
        const snapshot = await getDocs(q);
        const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsletterSubscribers(subs);
      } catch (err) {
        console.error("Error fetching newsletter subscribers:", err);
      }
    };
    fetchSubscribers();
  }, [isAuthenticated]);

  // Fetch roadshow registrations (real-time)
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, 'roadshowRegistrations'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRoadshowRegs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);


  const loadSubmissions = useCallback(async () => {
    try {
      // Removed unused variable 'q' to resolve ESLint warning
      // ...existing code for fetching submissions...
    } catch (error) {
      // ...existing error handling...
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        loadSubmissions();
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [loadSubmissions]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const q = query(
      collection(db, 'subscriptions'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        let type = data.type;
        // Infer type if missing or invalid
        if (!type || (type !== 'event' && type !== 'membership')) {
          if (
            (typeof data.subscriptionType === 'string' && data.subscriptionType.toLowerCase().includes('event')) ||
            (typeof data.ticketId === 'string' && data.ticketId.trim() !== '')
          ) {
            type = 'event';
          } else {
            type = 'membership';
          }
        }
        return {
          id: doc.id,
          ...data,
          type
        };
      });
      setSubmissions(submissionsData);
    }, (error) => {
      console.error('Error listening to submissions:', error);
      showNotification('Error loading submissions', 'error');
    });
    
    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      showNotification('Login successful', 'success');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setLoginError('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Please try again later.');
      } else {
        setLoginError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Error logging out', 'error');
    }
  };

  // ...existing code...

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ========================================
  // GENERATE QR CODE WITH USER DATA
  // ========================================
 const generateQRCodeWithUserData = async (submission, ticketId) => {
  try {
    // Automatically uses correct URL (localhost in dev, production URL when deployed)
    const baseUrl = window.location.origin;
    const verificationUrl = `${baseUrl}/verify?ticket=${ticketId}&name=${encodeURIComponent(submission.fullName)}&plan=${encodeURIComponent(submission.planName)}&verified=true`;

    console.log('✅ Generated verification URL:', verificationUrl);

    const qrCodeImage = await QRCode.toDataURL(verificationUrl, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#306CEC',
        light: '#FFFFFF'
      }
    });

    return qrCodeImage;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

  // ========================================
  // SEND APPROVAL EMAIL WITH QR TICKET
  // ========================================
const sendApprovalEmailWithTicket = async (submission, ticketId) => {
  try {
    console.log('Generating QR code ticket for:', submission.fullName);
    
    const qrCodeImage = await generateQRCodeWithUserData(submission, ticketId);

    if (!qrCodeImage) {
      throw new Error('Failed to generate QR code');
    }

    console.log(' QR code generated successfully');

    const templateParams = {
      to_email: submission.email,
      email_subject: 'Your Impact360 Event Ticket',
      
      // WELCOME MESSAGE
      welcome_message: `
        <div style="padding: 40px 30px; background-color: #F8F9FA; border-radius: 15px; margin-bottom: 30px; border-left: 5px solid #306CEC;">
          <h2 style="color: #306CEC; margin: 0 0 25px 0; font-size: 26px; font-weight: bold;">Welcome, ${submission.fullName}</h2>
          
          <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 18px 0;">
            We're glad to have you join this experience. Your participation means you are stepping into a space built for <strong>bold conversations</strong>, <strong>practical insights</strong>, and <strong>meaningful connections</strong> that go beyond surface-level thinking.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 18px 0;">
            This is more than an event. It is a room for <strong>thinkers</strong>, <strong>builders</strong>, and <strong>doers</strong> who are ready to engage, challenge ideas, and leave with clarity and direction.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
            Thank you for being part of this community. We look forward to the experience we'll create together.
          </p>
          
          <p style="color: #306CEC; font-size: 17px; font-weight: bold; margin: 0;">
            — Impact360 Team
          </p>
        </div>
      `,
      
      // TICKET WITH QR CODE
      additional_info: `
        <div style="text-align: center; padding: 50px 30px; background-color: #F0F9FF; border-radius: 15px; border: 2px solid #306CEC;">
          
          <h2 style="color: #306CEC; margin: 0 0 35px 0; font-size: 28px; font-weight: bold;">YOUR EVENT TICKET</h2>
          
          <div style="background-color: white; padding: 35px; border-radius: 15px; display: inline-block; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 420px;">
            
            <div style="margin-bottom: 30px; padding-bottom: 25px; border-bottom: 3px solid #306CEC;">
              <p style="margin: 0; color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Attendee</p>
              <h3 style="margin: 8px 0 0 0; color: #306CEC; font-size: 26px; font-weight: bold;">${submission.fullName.toUpperCase()}</h3>
            </div>
            
            <div style="margin: 30px 0;">
              <img src="${qrCodeImage}" alt="Event Ticket QR Code" style="display: block; max-width: 320px; width: 100%; height: auto; margin: 0 auto; border: 5px solid #306CEC; border-radius: 12px; box-shadow: 0 4px 12px rgba(48, 108, 236, 0.2);" />
            </div>
            
            <div style="margin-top: 30px; padding-top: 25px; border-top: 2px dashed #DDD; text-align: left;">
              <table style="width: 100%; font-size: 15px;">
                <tr>
                  <td style="padding: 10px 0; color: #888; font-weight: bold;">Ticket ID:</td>
                  <td style="padding: 10px 0; color: #306CEC; font-weight: bold; font-family: monospace; font-size: 14px;">${ticketId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-weight: bold;">Plan:</td>
                  <td style="padding: 10px 0; color: #333; font-weight: 600;">${submission.planName} (${submission.planPeriod})</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0; color: #333; word-break: break-word;">${submission.email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px 0; color: #333;">${submission.phone}</td>
                </tr>
              </table>
            </div>
          </div>
          
          <div style="background-color: #FFF3CD; padding: 28px; border-radius: 12px; margin-top: 35px; text-align: left; border-left: 5px solid #FFD700;">
            <p style="margin: 0 0 18px 0; font-weight: bold; color: #856404; font-size: 17px;">📋 Event Entry Instructions</p>
            <ol style="margin: 0; padding-left: 22px; color: #856404; line-height: 2.2; font-size: 15px;">
              <li><strong>Save this email</strong> or screenshot the QR code above</li>
              <li><strong>Arrive 15 minutes early</strong> to the event venue</li>
              <li><strong>Show your QR code</strong> at the registration desk</li>
              <li><strong>Enjoy the event!</strong> Engage, learn, and connect</li>
            </ol>
          </div>
          
          <div style="margin-top: 28px; padding: 22px; background-color: #D4EDDA; border-radius: 10px; border-left: 5px solid #28a745;">
            <p style="margin: 0; color: #155724; font-size: 15px; text-align: left; line-height: 1.7;">
              <strong>📅 Event Details</strong><br>
              Date: 7th February 2026<br>
              Venue: Taidy's Nakuru<br>
              Time:From 1:30pm<br>
            </p>
          </div>
          
        </div>
      `
    };

    console.log('📧 Sending approval email to:', submission.email);
    
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATE_USER,
      templateParams
    );

    console.log(' Approval email with QR ticket sent successfully!');
    return true;

  } catch (error) {
    console.error('❌ Failed to send approval email:', error);
    return false;
  }
};

  // ========================================
  // SEND REJECTION EMAIL
  // ========================================
  const sendRejectionEmail = async (submission, reason) => {
    try {
      const templateParams = {
        to_email: submission.email,
        email_subject: ' Subscription Status Update - Action Required',
        email_icon: '⚠️',
        greeting: 'Status Update',
        status_message: 'Your subscription requires attention',
        user_name: submission.fullName,
        main_message: `We've reviewed your ${submission.planName} Plan subscription request. Unfortunately, we were unable to approve it at this time.`,
        plan_name: submission.planName,
        plan_period: submission.planPeriod,
        amount: submission.amount,
        mpesa_code: submission.mpesaCode,
        id_label: 'Reference ID',
        reference_id: submission.id,
        event_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        header_color: 'background-color: #F8D7DA',
        notice_color: 'background-color: #FEE',
        notice_border: '#F44',
        notice_title: '❌ Reason for Rejection',
        notice_message: reason,
        additional_info: `
          <h4 style="margin-bottom: 10px;">What You Can Do:</h4>
          <ol style="margin-top: 0;">
            <li>Verify your M-Pesa transaction details are correct</li>
            <li>Contact our support team for clarification</li>
            <li>Submit a new request with corrected information</li>
          </ol>
          <p style="margin-top: 15px;">
            <strong>Need help?</strong> Email us at support@impact360.com
          </p>
        `,
        closing_message: 'We appreciate your understanding and look forward to welcoming you to Impact360.'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_USER,
        templateParams
      );

      console.log('✅ Rejection email sent');
      return true;
    } catch (error) {
      console.error('❌ Failed to send rejection email:', error);
      return false;
    }
  };

  // ========================================
  // HANDLE APPROVE
  // ========================================
  const handleApprove = async (submission) => {
    if (!window.confirm(`Approve subscription for ${submission.fullName}?`)) {
      return;
    }
    setLoading(true);
    try {
      console.log('🔄 Starting approval process for:', submission.fullName);
      let emailSent = false;
      if (submission.type === 'membership') {
        // Calculate expiry date (e.g., 1 year from now, or based on planPeriod)
        let expiryDate;
        if (submission.planPeriod && submission.planPeriod.toLowerCase().includes('year')) {
          const now = new Date();
          now.setFullYear(now.getFullYear() + 1);
          expiryDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if (submission.planPeriod && submission.planPeriod.toLowerCase().includes('month')) {
          const now = new Date();
          now.setMonth(now.getMonth() + 1);
          expiryDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else {
          // Default to 1 year if not specified
          const now = new Date();
          now.setFullYear(now.getFullYear() + 1);
          expiryDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        await updateDoc(doc(db, 'subscriptions', submission.id), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: currentUser.email,
          expiryDate: expiryDate,
          updatedAt: new Date().toISOString()
        });
        emailSent = await sendMembershipActivationEmail(submission, expiryDate);
        if (emailSent) {
          showNotification(`Membership activated for ${submission.fullName} (${submission.email})`, 'success');
          alert(`Membership Approval Complete!\n\nUser: ${submission.fullName}\nEmail: ${submission.email}\nExpiry Date: ${expiryDate}\n\nMembership activation email has been sent.`);
        } else {
          showNotification('Membership approved but email failed', 'error');
        }
      } else {
        // Event type (default)
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        await updateDoc(doc(db, 'subscriptions', submission.id), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: currentUser.email,
          ticketId: ticketId,
          updatedAt: new Date().toISOString()
        });
        emailSent = await sendApprovalEmailWithTicket(submission, ticketId);
        if (emailSent) {
          showNotification(` Success! Ticket sent to ${submission.fullName} at ${submission.email}`, 'success');
          alert(`Approval Complete!\n\nUser: ${submission.fullName}\nEmail: ${submission.email}\nTicket ID: ${ticketId}\n\nQR code ticket has been sent to the user's email.`);
        } else {
          showNotification(`⚠️ Approved but email failed. Ticket ID: ${ticketId}`, 'error');
        }
      }
      setSelectedSubmission(null);
    } catch (error) {
      console.error('❌ Error during approval:', error);
      showNotification('Error approving submission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // HANDLE REJECT
  // ========================================
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showNotification('Please provide a rejection reason', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'subscriptions', selectedSubmission.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.email,
        rejectionReason: rejectionReason,
        updatedAt: new Date().toISOString()
      });
      
      const emailSent = await sendRejectionEmail(selectedSubmission, rejectionReason);
      
      if (emailSent) {
        showNotification(' Rejected & email sent', 'success');
      } else {
        showNotification(' Rejected but email failed', 'error');
      }
      
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      showNotification('Error rejecting submission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editData.fullName || !editData.email || !editData.phone) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Filter out undefined values
      const updateData = Object.fromEntries(
        Object.entries(editData).filter(([_, value]) => value !== undefined && value !== '')
      );
      
      await updateDoc(doc(db, 'subscriptions', selectedSubmission.id), {
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.email || 'admin'
      });
      
      showNotification('Submission updated successfully', 'success');
      setShowEditModal(false);
      setSelectedSubmission(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating submission:', error);
      showNotification('Error updating submission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'subscriptions', selectedSubmission.id));
      showNotification('Submission deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
      showNotification('Error deleting submission: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (submission) => {
    setSelectedSubmission(submission);
    setEditData({
      fullName: submission.fullName,
      position: submission.position,
      email: submission.email,
      phone: submission.phone,
      city: submission.city,
      mpesaCode: submission.mpesaCode,
      mpesaMessage: submission.mpesaMessage,
      amount: submission.amount
    });
    setShowEditModal(true);
  };

  const filteredSubmissions = submissions
    .filter(s => {
      if (filter === 'all') return true;
      if (filter === 'event' || filter === 'membership') return s.type === filter;
      return s.status === filter;
    })
    .filter(s => {
      if (planFilter === 'all') return true;
      return s.planPeriod === planFilter;
    })
    .filter(s => {
      if (tierFilter === 'all') return true;
      return s.planName === tierFilter;
    })
    .filter(s =>
      s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mpesaCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    total: submissions.length,
    spotlight: submissions.filter(s => s.planPeriod === 'spotlight').length,
    momentum: submissions.filter(s => s.planPeriod === 'momentum').length,
    mastery: submissions.filter(s => s.planPeriod === 'mastery').length,
    approvedSpotlight: submissions.filter(s => s.status === 'approved' && s.planPeriod === 'spotlight').length,
    approvedMomentum: submissions.filter(s => s.status === 'approved' && s.planPeriod === 'momentum').length,
    approvedMastery: submissions.filter(s => s.status === 'approved' && s.planPeriod === 'mastery').length,
    // Tier counts for each plan
    spotlightStudent: submissions.filter(s => s.planPeriod === 'spotlight' && s.planName === 'Student' && s.status === 'approved').length,
    spotlightPro: submissions.filter(s => s.planPeriod === 'spotlight' && s.planName === 'Pro' && s.status === 'approved').length,
    spotlightPremium: submissions.filter(s => s.planPeriod === 'spotlight' && s.planName === 'Premium' && s.status === 'approved').length,
    momentumStudent: submissions.filter(s => s.planPeriod === 'momentum' && s.planName === 'Student' && s.status === 'approved').length,
    momentumPro: submissions.filter(s => s.planPeriod === 'momentum' && s.planName === 'Pro' && s.status === 'approved').length,
    momentumPremium: submissions.filter(s => s.planPeriod === 'momentum' && s.planName === 'Premium' && s.status === 'approved').length,
    masteryStudent: submissions.filter(s => s.planPeriod === 'mastery' && s.planName === 'Student' && s.status === 'approved').length,
    masteryPro: submissions.filter(s => s.planPeriod === 'mastery' && s.planName === 'Pro' && s.status === 'approved').length,
    masteryPremium: submissions.filter(s => s.planPeriod === 'mastery' && s.planName === 'Premium' && s.status === 'approved').length
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block p-3 sm:p-4 bg-blue-100 rounded-full mb-3 sm:mb-4">
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-sm sm:text-base text-gray-600">Impact360 Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="admin@impact360.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="Enter password"
              />
            </div>
            
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition-colors text-base"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            Contact your system administrator if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white flex items-center gap-2 sm:gap-3`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
          <span className="text-sm sm:text-base">{notification.message}</span>
        </div>
      )}

      <div className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Impact360 Admin</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{currentUser?.email}</p>
            </div>
            
            <div className="hidden sm:flex gap-3">
              <button
                onClick={loadSubmissions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {showMobileMenu && (
            <div className="sm:hidden mt-4 pt-4 border-t space-y-2">
              <button
                onClick={() => {
                  loadSubmissions();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Mail className="hidden sm:block w-8 sm:w-12 h-8 sm:h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="hidden sm:block w-8 sm:w-12 h-8 sm:h-12 text-yellow-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Approved</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="hidden sm:block w-8 sm:w-12 h-8 sm:h-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Rejected</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="hidden sm:block w-8 sm:w-12 h-8 sm:h-12 text-red-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or M-Pesa code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Section tabs */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => setActiveSection('subscriptions')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  activeSection === 'subscriptions' ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Membership
              </button>
              <button
                onClick={() => { setActiveSection('locals'); setLocalTierFilter('all'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  activeSection === 'locals' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                }`}
              >
                Locals ({submissions.filter(s => s.type === 'event').length})
              </button>
              <button
                onClick={() => { setActiveSection('roadshow'); setRoadshowCityFilter('all'); setSelectedRoadshowReg(null); setRoadshowView('registrations'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  activeSection === 'roadshow' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                }`}
              >
                Roadshow Registrations ({roadshowRegs.length})
              </button>
            </div>

            {/* Status filter buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3">
              <button
                onClick={() => { setFilter('pending'); setPlanFilter('all'); setTierFilter('all'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => { setFilter('approved'); setPlanFilter('all'); setTierFilter('all'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => { setFilter('rejected'); setPlanFilter('all'); setTierFilter('all'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
              <button
                onClick={() => { setFilter('all'); setPlanFilter('all'); setTierFilter('all'); }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({stats.total})
              </button>
            </div>

            {/* Plan filter buttons - Only show when viewing approved submissions */}
            {filter === 'approved' && (
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 border-t pt-3 mb-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full mb-2">Filter by Plan:</span>
                <button
                  onClick={() => { setPlanFilter('all'); setTierFilter('all'); }}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    planFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Plans
                </button>
                <button
                  onClick={() => { setPlanFilter('spotlight'); setTierFilter('all'); }}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    planFilter === 'spotlight' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🎯 Spotlight ({stats.approvedSpotlight})
                </button>
                <button
                  onClick={() => { setPlanFilter('momentum'); setTierFilter('all'); }}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    planFilter === 'momentum' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ⚡ Momentum ({stats.approvedMomentum})
                </button>
                <button
                  onClick={() => { setPlanFilter('mastery'); setTierFilter('all'); }}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    planFilter === 'mastery' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  👑 Mastery ({stats.approvedMastery})
                </button>
              </div>
            )}

            {/* Tier filter buttons - Show when a specific plan is selected */}
            {filter === 'approved' && planFilter !== 'all' && (
              <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full mb-2">Filter by Tier:</span>
                <button
                  onClick={() => setTierFilter('all')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    tierFilter === 'all' ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  All Tiers
                </button>
                <button
                  onClick={() => setTierFilter('Student')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    tierFilter === 'Student' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  👨‍🎓 Student ({planFilter === 'spotlight' ? stats.spotlightStudent : planFilter === 'momentum' ? stats.momentumStudent : stats.masteryStudent})
                </button>
                <button
                  onClick={() => setTierFilter('Pro')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    tierFilter === 'Pro' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  💼 Pro ({planFilter === 'spotlight' ? stats.spotlightPro : planFilter === 'momentum' ? stats.momentumPro : stats.masteryPro})
                </button>
                <button
                  onClick={() => setTierFilter('Premium')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    tierFilter === 'Premium' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  💎 Premium ({planFilter === 'spotlight' ? stats.spotlightPremium : planFilter === 'momentum' ? stats.momentumPremium : stats.masteryPremium})
                </button>
              </div>
            )}
          </div>
        </div>

        {activeSection === 'locals' && (() => {
          const localSubs = submissions.filter(s => s.type === 'event');
          const localFiltered = localSubs
            .filter(s => localTierFilter === 'all' || s.planName === localTierFilter)
            .filter(s => s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || s.email?.toLowerCase().includes(searchTerm.toLowerCase()) || s.mpesaCode?.toLowerCase().includes(searchTerm.toLowerCase()));

          const tc = {
            Student:  localSubs.filter(s => s.planName === 'Student').length,
            Standard: localSubs.filter(s => s.planName === 'Standard').length,
          };

          return (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total', value: localSubs.length, color: 'blue' },
                  { label: 'Pending', value: localSubs.filter(s => s.status === 'pending').length, color: 'yellow' },
                  { label: 'Approved', value: localSubs.filter(s => s.status === 'approved').length, color: 'green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-lg shadow p-4">
                    <p className={`text-gray-500 text-xs`}>{label}</p>
                    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Tier filter */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-gray-500 w-full">Filter by Tier:</span>
                  {[
                    { key: 'all',      label: 'All',      count: localSubs.length },
                    { key: 'Student',  label: 'Student',  count: tc.Student },
                    { key: 'Standard', label: 'Standard', count: tc.Standard },
                  ].map(({ key, label, count }) => (
                    <button key={key}
                      onClick={() => setLocalTierFilter(key)}
                      className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${localTierFilter === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {localFiltered.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No local event submissions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Plan</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">City</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">M-Pesa</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localFiltered.map((s, idx) => (
                          <tr key={s.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 font-medium text-gray-900">{s.fullName}</td>
                            <td className="px-4 py-3 text-gray-600">{s.email}</td>
                            <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{s.planName}</span></td>
                            <td className="px-4 py-3 text-gray-600">{s.city}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-700">{s.mpesaCode || '—'}</td>
                            <td className="px-4 py-3 text-gray-700">KES {s.amount || '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                s.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                s.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>{s.status?.toUpperCase()}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => setSelectedSubmission(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                                {s.status === 'pending' && <>
                                  <button onClick={() => handleApprove(s)} disabled={loading} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve"><Check className="w-4 h-4" /></button>
                                  <button onClick={() => { setSelectedSubmission(s); setShowRejectModal(true); }} disabled={loading} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject"><X className="w-4 h-4" /></button>
                                </>}
                                <button onClick={() => openEditModal(s)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" title="Edit"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => { setSelectedSubmission(s); setShowDeleteModal(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {activeSection === 'roadshow' && (() => {
          const cities = ['Nakuru', 'Eldoret', 'Kisumu', 'Nairobi', 'Mombasa', 'Arusha', 'Kigali', 'Addis Ababa', 'Kampala'];
          const filtered = roadshowRegs
            .filter(r => roadshowCityFilter === 'all' || r.city === roadshowCityFilter)
            .filter(r => !roadshowSearch || r.name?.toLowerCase().includes(roadshowSearch.toLowerCase()) || r.email?.toLowerCase().includes(roadshowSearch.toLowerCase()) || r.phone?.includes(roadshowSearch));
          return (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Roadshow Registrations</h2>
                {roadshowRegs.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {roadshowRegs.some(r => r.inviteSent) && (
                      <button onClick={resetAllInviteSent} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors">
                        ↺ Reset All Sent Marks
                      </button>
                    )}
                    <button onClick={() => setShowClearConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                      <Trash2 size={13} /> Clear All Data
                    </button>
                  </div>
                )}
              </div>

              {/* Confirm clear dialog */}
              {showClearConfirm && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-700 mb-3">Delete all {roadshowRegs.length} registrations permanently? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={clearAllRoadshowRegs}
                      disabled={clearing}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-60"
                    >
                      {clearing ? 'Deleting…' : 'Yes, delete all'}
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search by name, email or phone..." value={roadshowSearch} onChange={e => setRoadshowSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>

              {/* View toggle */}
              <div className="flex gap-2 mb-5">
                <button onClick={() => setRoadshowView('registrations')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roadshowView === 'registrations' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Registrations</button>
                <button onClick={() => setRoadshowView('marketing')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roadshowView === 'marketing' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Marketing</button>
              </div>

              {roadshowView === 'marketing' && (() => {
                const sources = ["From a Friend", "Instagram", "LinkedIn", "TikTok", "Other"];
                const regsWithSource = roadshowRegs.filter(r => sources.includes(r.hearAbout));
                if (regsWithSource.length === 0) return <p className="text-sm text-gray-500 py-6 text-center">No marketing data yet. Data will appear after the next registration.</p>;
                const counts = sources.map(s => ({ label: s, count: regsWithSource.filter(r => r.hearAbout === s).length })).filter(c => c.count > 0);
                return (
                  <div className="flex flex-wrap gap-4 py-2">
                    {counts.map(({ label, count }) => (
                      <div key={label} className="px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center min-w-[100px]">
                        <p className="text-2xl font-bold text-indigo-700">{count}</p>
                        <p className="text-xs text-gray-500 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {roadshowView === 'registrations' && <>
              {/* City filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setRoadshowCityFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${roadshowCityFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  All ({roadshowRegs.length})
                </button>
                {cities.map(city => {
                  const count = roadshowRegs.filter(r => r.city === city).length;
                  return (
                    <button key={city} onClick={() => setRoadshowCityFilter(city)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${roadshowCityFilter === city ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {city} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No registrations for this city yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Phone</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Organization</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">City</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Attended</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((reg, idx) => (
                        <>
                          <tr key={reg.id} className={`border-t hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 font-medium text-gray-900 cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>{reg.name}</td>
                            <td className="px-4 py-3 text-gray-600 cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>{reg.email}</td>
                            <td className="px-4 py-3 text-gray-600 cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>
                              <a href={`https://wa.me/${reg.phone?.replace(/[\s+\-()]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline" onClick={e => e.stopPropagation()}>{reg.phone}</a>
                            </td>
                            <td className="px-4 py-3 text-gray-600 cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>{reg.organization}</td>
                            <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}><span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{reg.city}</span></td>
                            <td className="px-4 py-3 text-gray-500 text-xs cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>{reg.submittedAt?.toDate ? reg.submittedAt.toDate().toLocaleDateString() : '—'}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleAttended(reg); }}
                                className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${reg.attended ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                              >
                                {reg.attended ? 'Attended ✓' : 'Mark Attended'}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (!reg.inviteSent) toggleInviteSent(reg); }}
                                  className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors ${reg.inviteSent ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600 cursor-pointer'}`}
                                >
                                  {reg.inviteSent ? 'Sent ✓' : 'Mark as Sent'}
                                </button>
                                <span className="text-indigo-500 text-xs cursor-pointer" onClick={() => setSelectedRoadshowReg(selectedRoadshowReg?.id === reg.id ? null : reg)}>{selectedRoadshowReg?.id === reg.id ? '▲' : '▼'}</span>
                                <button
                                  onClick={() => setRegToDelete(reg)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {selectedRoadshowReg?.id === reg.id && (
                            <tr key={`${reg.id}-detail`} className="bg-indigo-50 border-t">
                              <td colSpan={7} className="px-6 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  {reg.whatYouDo && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">What they do</p>
                                      <p className="text-gray-800">{reg.whatYouDo}</p>
                                    </div>
                                  )}
                                  {reg.whySigningUp && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Why signing up?</p>
                                      <p className="text-gray-800">{reg.whySigningUp}</p>
                                    </div>
                                  )}
                                  {reg.specificQuestions && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Specific Questions</p>
                                      <p className="text-gray-800">{reg.specificQuestions}</p>
                                    </div>
                                  )}
                                  {reg.expectations && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Expectations</p>
                                      <p className="text-gray-800">{reg.expectations}</p>
                                    </div>
                                  )}
                                  {reg.hearAbout && (
                                    <div>
                                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">How they heard about us</p>
                                      <p className="text-gray-800">{reg.hearAbout}</p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </>}
            </div>
          );
        })()}

        {activeSection === 'subscriptions' && <><div className="lg:hidden space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{submission.fullName}</h3>
                  <p className="text-sm text-gray-600 truncate">{submission.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${
                  submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {submission.status?.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">{submission.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">KES {submission.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">M-Pesa:</span>
                  <span className="font-mono text-xs text-gray-900">{submission.mpesaCode}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSubmission(submission)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                
                {submission.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(submission)}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setShowRejectModal(true);
                      }}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => openEditModal(submission)}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No submissions found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">M-Pesa Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{submission.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{submission.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {submission.planName}
                      <br />
                      <span className="text-xs text-gray-500">{submission.planPeriod}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{submission.city || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{submission.mpesaCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">KES {submission.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{submission.type || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {submission.createdAt?.toDate ? submission.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(submission)}
                              disabled={loading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setShowRejectModal(true);
                              }}
                              disabled={loading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => openEditModal(submission)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No submissions found</p>
                <p className="text-sm">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
        </>}
      </div>

      {showRejectModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4">Reject Submission</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Please provide a reason for rejecting this submission.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 min-h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
              >
                {loading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Submission</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={editData.fullName || ''}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={editData.position || ''}
                  onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                {selectedSubmission?.type === 'event' && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                      value={editData.city || ''}
                      onChange={e => setEditData({ ...editData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select city</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kisumu">Kisumu</option>
                      <option value="Eldoret">Eldoret</option>
                      <option value="Thika">Thika</option>
                      <option value="Machakos">Machakos</option>
                      <option value="Other">Other</option>
                    </select>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Code</label>
                <input
                  type="text"
                  value={editData.mpesaCode || ''}
                  onChange={(e) => setEditData({ ...editData, mpesaCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                <input
                  type="text"
                  value={editData.amount || ''}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Message</label>
                <textarea
                  value={editData.mpesaMessage || ''}
                  onChange={(e) => setEditData({ ...editData, mpesaMessage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditData({});
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4 text-red-600">Delete Submission</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete the submission from <strong>{selectedSubmission?.fullName}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedSubmission && !showRejectModal && !showEditModal && !showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-6 my-8 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Submission Details</h3>
        <button
          onClick={() => setSelectedSubmission(null)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
      
      <div className="space-y-4 text-sm sm:text-base">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-base sm:text-lg text-gray-900">{selectedSubmission.fullName}</p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Position</label>
            <p className="text-base sm:text-lg text-gray-900">{selectedSubmission.position || 'N/A'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
            <p className="text-base sm:text-lg break-all text-gray-900">{selectedSubmission.email}</p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Phone</label>
            <p className="text-base sm:text-lg text-gray-900">{selectedSubmission.phone}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Plan</label>
            <p className="text-base sm:text-lg text-gray-900">{selectedSubmission.planName}</p>
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Period</label>
            <p className="text-base sm:text-lg text-gray-900">{selectedSubmission.planPeriod}</p>
          </div>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-500">M-Pesa Transaction Code</label>
          <p className="text-base sm:text-lg font-mono bg-gray-100 p-3 rounded break-all text-gray-900">
            {selectedSubmission.mpesaCode}
          </p>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-500">Amount Paid</label>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            KES {selectedSubmission.amount}
          </p>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-500">M-Pesa Message</label>
          <p className="text-xs sm:text-sm bg-gray-100 p-3 rounded whitespace-pre-wrap break-words text-gray-900">
            {selectedSubmission.mpesaMessage}
          </p>
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-500">Status</label>
          <p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              selectedSubmission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              selectedSubmission.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedSubmission.status?.toUpperCase()}
            </span>
          </p>
        </div>
        
        {selectedSubmission.status === 'approved' && selectedSubmission.ticketId && (
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Ticket ID</label>
            <p className="text-base sm:text-lg font-mono bg-green-50 p-3 rounded break-all text-green-700">
              {selectedSubmission.ticketId}
            </p>
          </div>
        )}
        
        {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Rejection Reason</label>
            <p className="text-xs sm:text-sm bg-red-50 p-3 rounded text-red-700">
              {selectedSubmission.rejectionReason}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Submitted At</label>
            <p className="text-xs sm:text-sm text-gray-900">
              {selectedSubmission.createdAt?.toDate
                ? selectedSubmission.createdAt.toDate().toLocaleString()
                : 'N/A'}
            </p>
          </div>
          {selectedSubmission.updatedAt && (
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-xs sm:text-sm text-gray-900">
                {selectedSubmission.updatedAt?.toDate
                  ? selectedSubmission.updatedAt.toDate().toLocaleString()
                  : new Date(selectedSubmission.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
        
        {selectedSubmission.approvedAt && (
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-500">Approved At</label>
            <p className="text-xs sm:text-sm text-green-600">
              {selectedSubmission.approvedAt?.toDate
                ? selectedSubmission.approvedAt.toDate().toLocaleString()
                : new Date(selectedSubmission.approvedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setSelectedSubmission(null)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-700"
        >
          Close
        </button>
        {selectedSubmission.status === 'pending' && (
          <>
            <button
              onClick={() => handleApprove(selectedSubmission)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <Check className="w-4 h-4 inline mr-2" />
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <X className="w-4 h-4 inline mr-2" />
              Reject
            </button>
          </>
        )}
        {selectedSubmission.status === 'rejected' && (
          <button
            onClick={() => openEditModal(selectedSubmission)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Edit & Resubmit
          </button>
        )}
      </div>
    </div>
  </div>
)}
    {/* Newsletter Subscribers Modal */}
    {showNewsletterModal && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setShowNewsletterModal(false)}
      >
        <div
          className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg border border-gray-200 font-sans"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => setShowNewsletterModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
          <h2 className="text-2xl font-extrabold mb-6 text-[#306CEC] text-center tracking-tight" style={{ fontFamily: 'League Spartan, DM Sans, Arial, sans-serif' }}>Newsletter Subscribers</h2>
          {newsletterSubscribers.length === 0 ? (
            <p className="text-gray-500 text-center text-base font-medium">No newsletter subscribers found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-[15px] text-gray-800 font-sans">
                <thead className="bg-[#f4f8ff]">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold tracking-wide text-base" style={{ fontFamily: 'League Spartan, DM Sans, Arial, sans-serif' }}>Email</th>
                    <th className="px-4 py-3 text-left font-bold tracking-wide text-base" style={{ fontFamily: 'League Spartan, DM Sans, Arial, sans-serif' }}>Subscribed At</th>
                    <th className="px-4 py-3 text-left font-bold tracking-wide text-base" style={{ fontFamily: 'League Spartan, DM Sans, Arial, sans-serif' }}>Status</th>
                    <th className="px-4 py-3 text-left font-bold tracking-wide text-base" style={{ fontFamily: 'League Spartan, DM Sans, Arial, sans-serif' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterSubscribers.map((sub, idx) => (
                    <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-mono break-all text-[15px]">{sub.email}</td>
                      <td className="px-4 py-3 text-[15px]">{sub.subscribedAt?.toDate ? sub.subscribedAt.toDate().toLocaleString() : (sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : '—')}</td>
                      <td className="px-4 py-3 capitalize text-[15px]">{sub.status || 'active'}</td>
                      <td className="px-4 py-3 text-[15px]">{sub.source || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Delete individual roadshow registration confirmation */}
    {regToDelete && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Registration</h3>
          <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete the registration for:</p>
          <p className="font-semibold text-gray-900 mb-1">{regToDelete.name}</p>
          <p className="text-sm text-gray-500 mb-6">{regToDelete.email} &middot; {regToDelete.city}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setRegToDelete(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={deleteRoadshowReg}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AdminDashboard;