import { describe, it, expect, vi } from "vitest";

const API_BASE_URL = "/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    super(`API Error ${status}`);
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  return res.json();
}

const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== null && body !== undefined ? JSON.stringify(body) : null,
    } as RequestInit),
};

describe("ApiClient", () => {
  describe("get", () => {
    it("returns JSON on 200", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ data: "test" }),
        })
      );

      const result = await apiClient.get<{ data: string }>("/test");
      expect(result.data).toBe("test");
    });
  });

  describe("post", () => {
    it("sends JSON body and returns response", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await apiClient.post<{ success: boolean }>("/test", {
        price: 100,
      });
      expect(result.success).toBe(true);
    });

    it("builds correct URL with base path", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });
      vi.stubGlobal("fetch", mockFetch);

      await apiClient.get("/auctions/test-uuid");
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/v1/auctions/test-uuid",
        expect.any(Object)
      );
    });
  });

  describe("error handling", () => {
    it("throws ApiError with status on 404", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: () =>
            Promise.resolve({ error: "NOT_FOUND", message: "Не найдено" }),
        })
      );

      await expect(apiClient.get("/missing")).rejects.toThrow("API Error 404");
    });

    it("throws ApiError with status on 422", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
          json: () =>
            Promise.resolve({
              error: "VALIDATION_ERROR",
              message: "Ошибка валидации",
              details: [],
            }),
        })
      );

      try {
        await apiClient.post("/test", {});
        expect.unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect((e as ApiError).status).toBe(422);
        expect((e as ApiError).body).toEqual({
          error: "VALIDATION_ERROR",
          message: "Ошибка валидации",
          details: [],
        });
      }
    });

    it("handles non-JSON error response gracefully", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.reject(new Error("not json")),
        })
      );

      await expect(apiClient.get("/error")).rejects.toThrow("API Error 500");
    });
  });
});
