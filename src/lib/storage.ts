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

/**
 * 🔹 Lưu hồ sơ tính cách người dùng vào localStorage
 */
export function savePersonalityProfile(profile: PersonalityProfile) {
    try {
        localStorage.setItem("personalityProfile", JSON.stringify(profile));
    } catch (error) {
        console.error("❌ Lỗi khi lưu personalityProfile:", error);
    }
}

/**
 * 🔹 Lấy hồ sơ tính cách người dùng từ localStorage
 */
export function getPersonalityProfile(): PersonalityProfile | null {
    try {
        const raw = localStorage.getItem("personalityProfile");
        if (!raw) return null;

        const data = JSON.parse(raw) as PersonalityProfile;

        // Validate typeKey hợp lệ
        if (!personalityTypes[data.typeKey]) {
            console.warn("⚠️ typeKey không hợp lệ, reset profile");
            return null;
        }

        // Đảm bảo có đầy đủ typeData
        return {
            ...data,
            typeData: personalityTypes[data.typeKey],
        };
    } catch (error) {
        console.error("❌ Lỗi khi đọc personalityProfile:", error);
        return null;
    }
}

/**
 * 🔹 Xóa toàn bộ dữ liệu người dùng (dùng khi làm lại bài test)
 */
export function clearPersonalityProfile() {
    try {
        localStorage.removeItem("personalityProfile");
    } catch (error) {
        console.error("❌ Lỗi khi xóa personalityProfile:", error);
    }
}

/**
 * 🔹 Cập nhật lại tên người dùng trong profile hiện tại
 */
export function updateUserName(name: string) {
    const profile = getPersonalityProfile();
    if (!profile) return;

    const updated: PersonalityProfile = {
        ...profile,
        userName: name,
    };

    savePersonalityProfile(updated);
}

/**
 * 🔹 Lưu tạm câu trả lời giữa chừng
 */
export function saveAnswers(answers: number[]) {
    const profile = getPersonalityProfile();

    // Tự động lấy lại typeData nếu có typeKey
    const fallbackTypeKey = profile?.typeKey ?? "balancer";
    const typeData = personalityTypes[fallbackTypeKey];

    const updated: PersonalityProfile = {
        userName: profile?.userName ?? "",
        typeKey: fallbackTypeKey,
        typeData,
        score: profile?.score ?? {
            busyBee: 0,
            chiller: 0,
            balancer: 0,
            overAchiever: 0,
        },
        answers,
        timestamp: Date.now(),
    };

    savePersonalityProfile(updated);
}

/**
 * 🔹 Reset toàn bộ (để bắt đầu lại từ đầu)
 */
export function resetAllStorage() {
    clearPersonalityProfile();
}
