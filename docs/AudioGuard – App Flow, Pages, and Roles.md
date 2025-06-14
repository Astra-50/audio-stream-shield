# **AudioGuard – App Flow, Pages, and Roles**

## **📄 Core Pages**

### **1\. Landing Page**

* Overview of features

* CTA to connect Discord or sign up

* Testimonials and case study clips

### **2\. Web Dashboard (Authenticated)**

* Stream session overview (active/inactive)

* Real-time and historical alert logs

* Detection sensitivity \+ webhook settings

* Tier-specific features (upgrade CTA if Free)

### **3\. Settings Page**

* Profile info (email, Discord ID)

* Notification and webhook preferences

* Panic button hotkey config

### **4\. Billing Page**

* Stripe integration for Free, Pro, Premium

* Subscription status and upgrade/downgrade

### **5\. Testimonials Page**

* Embedded video clips

* Quotes from streamers

* “It saved my stream” stories

### **6\. Login / Auth Page**

* Email/password login

* Discord OAuth option

## **👤 User Roles**

### **1\. Free User**

* Access to panic button

* Manual OBS setup only

* No real-time alerts or historical logs

### **2\. Pro User**

* Real-time Discord alerts

* Access to alert dashboard

* Adjustable sensitivity

### **3\. Premium User (Future)**

* AI-powered Shield

* Auto-muting or overlays

* Upload custom tracklists

### **4\. Admin**

* Manage users and billing

* View error logs

* Approve testimonials or flagged content

## **🔄 App Flow Summary**

1. User signs up → connects Discord → adds bot to server

2. Installs OBS audio routing setup

3. Goes live → audio is routed to AudioGuard

4. Bot sends alerts (Pro+) → user checks dashboard (Pro+)

5. Panic command can be used anytime (all users)

6. Dashboard shows logs, settings, subscription info

