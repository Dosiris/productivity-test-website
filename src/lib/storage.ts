import { PersonalityScore, personalityTypes } from "@/lib/personalityScoring";

/** Dữ liệu đầy đủ về tính cách */
export interface PersonalityProfile {
    userName: string;
    answers: number[];
    score: PersonalityScore;
    typeKey: keyof typeof personalityTypes;
    typeData: (typeof personalityTypes)[keyof typeof personalityTypes];
    timestamp: number;
}

/** 🔹 Lưu hồ sơ tính cách người dùng */
export function savePersonalityProfile(profile: PersonalityProfile) {
    try {
        localStorage.setItem("personalityProfile", JSON.stringify(profile));
        localStorage.setItem("userName", profile.userName);
    } catch (error) {
        console.error("❌ Lỗi khi lưu personalityProfile:", error);
    }
}

/** 🔹 Lấy hồ sơ tính cách người dùng */
export function getPersonalityProfile(): PersonalityProfile | null {
    try {
        const raw = localStorage.getItem("personalityProfile");
        if (!raw) return null;
        const data = JSON.parse(raw) as PersonalityProfile;

        if (!personalityTypes[data.typeKey]) {
            console.warn("⚠️ typeKey không hợp lệ, reset profile");
            return null;
        }

        return { ...data, typeData: personalityTypes[data.typeKey] };
    } catch (error) {
        console.error("❌ Lỗi khi đọc personalityProfile:", error);
        return null;
    }
}

/** 🔹 Xóa dữ liệu */
export function clearPersonalityProfile() {
    try {
        localStorage.removeItem("personalityProfile");
        localStorage.removeItem("userName");
    } catch (error) {
        console.error("❌ Lỗi khi xóa personalityProfile:", error);
    }
}

/** 🔹 Cập nhật tên người dùng */
export function updateUserName(name: string) {
    const profile = getPersonalityProfile();
    if (!profile) return;

    const updated: PersonalityProfile = { ...profile, userName: name };
    savePersonalityProfile(updated);
}

/** 🔹 Cập nhật kết quả bài test mới */
export function updatePersonalityResults(newData: {
    userName?: string;
    answers: number[];
    score: PersonalityScore;
    typeKey: keyof typeof personalityTypes;
    typeData: (typeof personalityTypes)[keyof typeof personalityTypes];
    timestamp?: number;
}) {
    const updated: PersonalityProfile = {
        userName: newData.userName ?? "Guest",
        answers: newData.answers,
        score: newData.score,
        typeKey: newData.typeKey,
        typeData: newData.typeData,
        timestamp: newData.timestamp ?? Date.now(),
    };

    savePersonalityProfile(updated);
}

/** 🔹 Reset toàn bộ dữ liệu */
export function resetAllStorage() {
    clearPersonalityProfile();
}
