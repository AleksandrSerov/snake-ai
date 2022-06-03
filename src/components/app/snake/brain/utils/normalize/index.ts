export const normalize = (value: number) => {
	if (value === 0) {
		return 0.000000000000001;
	}

	return 1 / value;
};
