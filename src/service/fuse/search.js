import Fuse from "fuse.js";

const fuseOptions = {
	isCaseSensitive: false,
	threshold: 0.3,
	keys: [
		"name",
		"description"
	]
};

const search = (list, searchPattern) => {
    const fuse = new Fuse(list, fuseOptions);
	const arr = [{ id: 1}, { id: 2 }, { id: 3 }];
	console.log(arr);
	console.log(list);
	console.log(searchPattern);
	const res = fuse.search(searchPattern);
	console.log(res);

    return res.map((point) => point.item);
}

export { search };