const User = require("../models/User")

class ProtectedController {
    welcome = async(req, res) => {
        res.status(200).json({
            message: "Hello, Welcome to the API"
        })
    }

    accountSummary = async(req, res) => {
        const fakeSummary = {
            balance: 1540.50,         // الرصيد الوهمي
            currency: "USD",          // العملة
            totalTransactions: 24,    // عدد العمليات
            lastLogin: "2026-06-07",  // تاريخ آخر دخول
            accountStatus: "active"   // حالة الحساب
        };
        res.status(200).json({
            message: "Get Summary",
            summary: fakeSummary
        })
    }

    overview = async(req, res) => {
        const fakeAdminOverview = {
            totalUsers: 1420,       // إجمالي المستخدمين في الموقع
            activeUsersToday: 315,  // المستخدمين النشطين اليوم
            totalRevenue: 12500.75, // إجمالي الأرباح الوهمية
            pendingReports: 4,      // عدد البلاغات أو الشكاوى المعلقة
            systemStatus: "healthy" // حالة السيرفر
        };

        res.status(200).json({
            message: "Get overview",
            summary: fakeAdminOverview
        })
    }

    users = async(req, res) => {
        const users = await User.find({role: "user"}).select("-password");

        res.status(200).json({
            message: "Get All Users Who Has Role User",
            users
        })
    }

    user = async(req, res) => {
        const userId = req.params.id;
        const currentAdminId = req._user.id;
        
        if(userId === currentAdminId) {
            return res.status(400).json({ 
                success: false, 
                message: "Can not Delete Beacuse You are Admin Account." 
            });
        }

        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return res.status(404).json({
                message: "Not Found"
            })
        }
        return res.status(204).json()
    }
}

module.exports = new ProtectedController();