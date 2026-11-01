import { MAX_DIMENSION } from "../shared"

export default function isValidDimension(value: unknown): value is number {
	return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= MAX_DIMENSION
}
