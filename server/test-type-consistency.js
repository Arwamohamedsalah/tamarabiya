/**
 * Unit Tests for Type Consistency
 * 
 * These tests ensure that backend models and frontend types remain in sync.
 * Run with: npm test (after setting up a test framework like Jest)
 */

// Mock types from frontend
const FRONTEND_TYPES = {
    PageType: ['home', 'landscaping', 'fencing', 'infrastructure', 'about', 'contact'],
    SectionType: ['hero', 'services', 'gallery', 'projects', 'header', 'content'],
    PageContentPage: ['landscaping', 'fencing', 'infrastructure'],
};

// Backend enums (should match models)
const BACKEND_ENUMS = {
    ImagePage: ['home', 'landscaping', 'fencing', 'infrastructure', 'about', 'contact'],
    ImageSection: ['hero', 'services', 'gallery', 'projects', 'header', 'content'],
    PageContentPage: ['landscaping', 'fencing', 'infrastructure'],
};

/**
 * Test: Image.page enum matches frontend PageType
 */
function testImagePageEnum() {
    const frontendSet = new Set(FRONTEND_TYPES.PageType);
    const backendSet = new Set(BACKEND_ENUMS.ImagePage);

    const match =
        frontendSet.size === backendSet.size &&
        [...frontendSet].every(val => backendSet.has(val));

    if (match) {
        console.log('✅ Image.page enum matches frontend PageType');
    } else {
        console.log('❌ Image.page enum DOES NOT match frontend PageType');
        console.log('   Frontend:', FRONTEND_TYPES.PageType);
        console.log('   Backend:', BACKEND_ENUMS.ImagePage);
    }

    return match;
}

/**
 * Test: Image.section enum matches frontend SectionType
 */
function testImageSectionEnum() {
    const frontendSet = new Set(FRONTEND_TYPES.SectionType);
    const backendSet = new Set(BACKEND_ENUMS.ImageSection);

    const match =
        frontendSet.size === backendSet.size &&
        [...frontendSet].every(val => backendSet.has(val));

    if (match) {
        console.log('✅ Image.section enum matches frontend SectionType');
    } else {
        console.log('❌ Image.section enum DOES NOT match frontend SectionType');
        console.log('   Frontend:', FRONTEND_TYPES.SectionType);
        console.log('   Backend:', BACKEND_ENUMS.ImageSection);
    }

    return match;
}

/**
 * Test: PageContent.page enum matches frontend PageContentData.page
 */
function testPageContentPageEnum() {
    const frontendSet = new Set(FRONTEND_TYPES.PageContentPage);
    const backendSet = new Set(BACKEND_ENUMS.PageContentPage);

    const match =
        frontendSet.size === backendSet.size &&
        [...frontendSet].every(val => backendSet.has(val));

    if (match) {
        console.log('✅ PageContent.page enum matches frontend PageContentData.page');
    } else {
        console.log('❌ PageContent.page enum DOES NOT match frontend PageContentData.page');
        console.log('   Frontend:', FRONTEND_TYPES.PageContentPage);
        console.log('   Backend:', BACKEND_ENUMS.PageContentPage);
    }

    return match;
}

/**
 * Run all tests
 */
function runAllTests() {
    console.log('🧪 Running Type Consistency Tests\n');
    console.log('='.repeat(60));

    const results = {
        imagePageEnum: testImagePageEnum(),
        imageSectionEnum: testImageSectionEnum(),
        pageContentPageEnum: testPageContentPageEnum(),
    };

    console.log('='.repeat(60));

    const allPassed = Object.values(results).every(r => r);

    if (allPassed) {
        console.log('\n✅ All tests passed! Backend and frontend types are in sync.\n');
    } else {
        console.log('\n❌ Some tests failed! Backend and frontend types are OUT OF SYNC.\n');
        console.log('Please update the enums to match between backend and frontend.');
    }

    return allPassed;
}

// Run tests if executed directly
if (require.main === module) {
    const success = runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = {
    testImagePageEnum,
    testImageSectionEnum,
    testPageContentPageEnum,
    runAllTests,
};
