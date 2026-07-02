import fse from "fs-extra";
import path from "path";

export const clearAndCopy = async (src: string, dest: string) => {
	fse.emptyDirSync(dest);
	await copyFolder(src, dest, ["node_modules"]);
};

/**
 * Copies a folder from source to destination, ignoring specified files and folders.
 * @param src Source folder path.
 * @param dest Destination folder path.
 * @param ignoreList List of file or folder names to ignore.
 */
export async function copyFolder(
	src: string,
	dest: string,
	ignoreList: string[]
): Promise<void> {
	await fse.ensureDir(dest);
	const items = await fse.readdir(src);

	for (const item of items) {
		if (ignoreList.includes(item)) {
			continue; // Skip ignored files/folders
		}

		const srcPath = path.join(src, item);
		const destPath = path.join(dest, item);
		const stat = await fse.stat(srcPath);

		if (stat.isDirectory()) {
			await copyFolder(srcPath, destPath, ignoreList); // Recursively copy folder
		} else {
			await fse.copy(srcPath, destPath); // Copy file
		}
	}
}
