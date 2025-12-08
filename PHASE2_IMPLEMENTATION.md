# Phase 2: Customer Portal - Implementation Guide

## ✅ Completed Features

### 1. Ticket Submission Form
**Location:** `/tickets/submit`

Features:
- User authentication required
- Form validation (subject and message required)
- Category selection (optional)
- Priority selection (optional)
- Success message with auto-redirect to ticket status
- Email notification sent on ticket creation

**Server Actions:** `src/app/actions/tickets.ts`
- `createTicket()` - Creates ticket and initial reply
- `getCategories()` - Fetches available categories
- `getPriorities()` - Fetches priority levels

### 2. Ticket Status Checker
**Location:** `/tickets/status`

Features:
- Search by Ticket ID + Email
- Displays ticket details (subject, status, category, priority)
- Shows conversation history (all non-internal replies)
- Status badge with color coding
- Formatted timestamps

**Server Actions:** `src/app/actions/tickets.ts`
- `getTicketStatus()` - Retrieves ticket with replies

### 3. Knowledge Base Browsing
**Location:** `/kb`

Features:
- Search articles by keyword (title, content, keywords)
- Filter by category
- Category chips for quick filtering
- Article count per category
- Responsive grid layout
- Link to submit ticket if answer not found

**Server Actions:** `src/app/actions/kb.ts`
- `getPublishedKbArticles()` - Search and filter articles
- `getKbCategories()` - Get categories with article counts

### 4. KB Article Detail View
**Location:** `/kb/[id]`

Features:
- Breadcrumb navigation
- Category badge (clickable)
- Author information
- Published and updated dates
- Keywords display
- Link to browse more articles or submit ticket

**Server Actions:** `src/app/actions/kb.ts`
- `getKbArticleById()` - Fetch single article

### 5. Email Notifications (Brevo Integration)
**Location:** `src/lib/email.ts`

Features:
- Ticket creation confirmation email
- Ticket update notification email
- HTML email templates
- Graceful degradation if API key not set

Functions:
- `sendTicketCreatedEmail()` - Sends confirmation
- `sendTicketUpdateEmail()` - Sends update notification

## 🎨 UI Updates

### Updated Homepage
- Added clickable cards linking to:
  - Submit Ticket
  - Knowledge Base
  - Track Ticket
- Improved visual feedback with hover effects

### Updated Navbar
- Added navigation links:
  - Knowledge Base
  - Submit Ticket
  - Track Ticket
- Desktop-only menu (hidden on mobile)

## 📦 Dependencies Added

```json
{
  "@getbrevo/brevo": "^2.2.0"
}
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:

```env
# Email Configuration (optional)
BREVO_API_KEY="your-api-key-from-brevo"
SUPPORT_EMAIL="support@yourdomain.com"
```

Get your Brevo API key from: https://app.brevo.com/settings/keys/api

**Note:** Email notifications are optional. The system will work without Brevo configuration, logging a warning instead.

## 🚀 Usage

### For Customers

1. **Submit a Ticket:**
   - Sign in or create account
   - Navigate to `/tickets/submit`
   - Fill in subject and message
   - Optionally select category and priority
   - Submit and receive email confirmation

2. **Check Ticket Status:**
   - Navigate to `/tickets/status`
   - Enter Ticket ID and email address
   - View ticket details and conversation

3. **Browse Knowledge Base:**
   - Navigate to `/kb`
   - Search articles or filter by category
   - Click article to read full content

### For Testing

To test the features, you'll need:

1. **Database with sample data:**
   ```bash
   # Create some categories
   # Create some KB articles
   # Create some priority levels
   ```

2. **Create test accounts:**
   - Sign up at `/auth/signup`
   - Sign in at `/auth/signin`

## 📝 Database Requirements

Make sure these tables have data:

1. **Category** - At least 2-3 categories
2. **Priority** - Low, Medium, High, Critical
3. **KbArticle** - At least 3-5 published articles
4. **User** - Test accounts

## 🎯 Next Steps (Phase 3 - Staff Portal)

- Staff dashboard
- Ticket management (assign, update status)
- Internal notes
- Reply to tickets
- KB article CRUD
- Team member management

## 🐛 Known Limitations

1. Email notifications require Brevo API key
2. No file attachments yet (planned for Phase 5)
3. No real-time updates (requires websockets or polling)
4. Mobile menu not implemented in navbar
5. No pagination on KB articles or ticket search

## 🔍 Testing Checklist

- [ ] Can submit ticket when logged in
- [ ] Cannot submit ticket when logged out (shows sign-in prompt)
- [ ] Email sent on ticket creation (if configured)
- [ ] Can view ticket status with ID + email
- [ ] Can search KB articles by keyword
- [ ] Can filter KB articles by category
- [ ] Can view individual KB article
- [ ] All links in navbar work
- [ ] Homepage cards are clickable
- [ ] Form validation works (empty subject/message)
