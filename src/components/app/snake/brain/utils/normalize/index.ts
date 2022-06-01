export const normalize = (value: number) => {
	if (value === 0) {
		return 0.0000001;
	}

	return 1 / value;
};
