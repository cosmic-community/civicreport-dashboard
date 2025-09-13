# CivicReport Dashboard

![CivicReport Dashboard](https://imgix.cosmicjs.com/9b316b50-9086-11f0-bcbd-9176d0adbb08-photo-1581092795360-fd1ca04f0952-1757756817625.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive React-based dashboard for managing civic issue reports, departments, and staff assignments. Built with Next.js and Tailwind CSS, this application provides municipal teams with powerful tools to track, assign, and resolve community-reported issues efficiently.

## ✨ Features

- **📊 Real-time Dashboard**: Overview of all civic issues with status indicators
- **🎯 Smart Filtering**: Filter by status, priority, department, and category
- **👥 Staff Management**: View and manage staff assignments across departments
- **🏢 Department Overview**: Track departmental workload and performance
- **📍 Location Tracking**: GPS coordinates and address visualization for each report
- **📸 Photo Evidence**: View uploaded images documenting civic issues
- **⚡ Priority System**: Color-coded priority levels with response time targets
- **📱 Responsive Design**: Full functionality on desktop, tablet, and mobile devices

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c53bea0a2eeaef39f42b27&clone_repository=68c53fa00a2eeaef39f42b61)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Crowdsourced Civic lssue Reporting and Resolution System
Description	
Background

Local governments often face challenges in promptly identifying, prioritizing, and resolving everyday civic issues like potholes, malfunctioning streetlights, or overflowing trash bins. While citizens may encounter these issues daily, a lack of effective reporting and tracking mechanisms limits municipal responsiveness. A streamlined, mobile-first solution can bridge this gap by empowering community members to submit real-world reports that municipalities can systematically address.

Detailed Description

The system revolves around an easy-to-use mobile interface that allows users to submit reports in real-time. Each report can contain a photo, automatic location tagging, and a short text or voice explanation, providing sufficient context. These submissions populate a centralized dashboard featuring a live, interactive map of the city's reported issues. The system highlights priority areas based on volume of submissions, urgency inferred from user inputs, or other configurable criteria.

On the administrative side, staff access a powerful dashboard where they can view, filter, and categorize incoming reports. Automated routing directs each report to the relevant department such as sanitation or public works based on the issue type and location. System architecture accommodates spikes in reporting, ensuring quick image uploads, responsive performance across devices, and near real-time updates on both mobile and desktop clients.

Expected Solution

The final deliverable should include a mobile platform that supports cross-device functionality and seamless user experience. Citizens must be able to capture issues effortlessly, track the progress of their reports, and receive notifications through each stage — confirmation, acknowledgment, and resolution.
On the back end, a web-based administrative portal should enable municipal staff to filter issues by category, location, or priority, assign tasks, update statuses, and communicate progress. The platform should integrate an automated routing engine that leverages report metadata to correctly allocate tasks to departments.
A scalable, resilient backend must manage high volumes of multimedia content, support concurrent users, and provide APIs for future integrations or extensions. Lastly, the solution should deliver analytics and reporting features that offer insights into reporting trends, departmental response times, and overall system effectiveness — ultimately driving better civic engagement and government accountability."

### Code Generation Prompt

> Create a React dashboard that displays and manages my existing content

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework for production
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **CMS**: [Cosmic](https://www.cosmicjs.com/docs) - Headless CMS for content management
- **TypeScript**: Type-safe development experience
- **Icons**: Lucide React for modern icon components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or higher
- Bun package manager (or npm/yarn)
- A Cosmic account with your bucket configured

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civicreport-dashboard
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Cosmic SDK Usage Examples

### Fetching Issue Reports
```typescript
const response = await cosmic.objects
  .find({ type: 'issue-reports' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(2);
const reports = response.objects;
```

### Updating Report Status
```typescript
await cosmic.objects.updateOne(reportId, {
  metadata: {
    status: 'In Progress',
    assigned_staff: staffMemberId
  }
});
```

## 🌐 Cosmic CMS Integration

This dashboard integrates with the following Cosmic object types:

- **Issue Reports**: Track civic issues with location, photos, and status
- **Departments**: Manage municipal departments and their responsibilities
- **Staff Members**: Track staff assignments and contact information
- **Report Categories**: Define issue types with priority levels and response targets

The application uses the Cosmic SDK to perform real-time CRUD operations, ensuring data consistency across all users.

## 🚀 Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify
1. Push your code to GitHub
2. Connect to Netlify
3. Add environment variables
4. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `.next`

## 📄 License

MIT License - feel free to use this project for your own civic management needs!

---

Built with ❤️ using [Cosmic](https://www.cosmicjs.com)
<!-- README_END -->